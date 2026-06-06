import { openai } from "./openai.service";
import { buildContext, buildMessages, makeError, toSourceDoc } from "../utils/rag.utils";
import { getVectorStore } from "./qdrant.service";
import type { Document } from "@langchain/core/documents";
import type { RagStreamOptions, StreamChunk, SourceDoc } from "../types/rag.types";
import { DEFAULTS, DOC_SEPARATOR } from "../utils/constant";

const retrieveDocs = async (
    question: string,
    topK: number,
    scoreThreshold: number,
): Promise<{ docs: Document[]; scored: SourceDoc[] }> => {
    const store = await getVectorStore();

    let raw: Array<[Document, number]>;
    
    try {
        raw = await store.similaritySearchWithScore(question, topK);
    } catch (error) {
        console.warn("[RAG] similaritySearchWithScore failed, falling back to basic retrieval:", error);
        const docs = await store.asRetriever({ k: topK }).invoke(question);
        raw = docs.map((d) => [d, 0.5] as [Document, number]);
    }

    const filtered = raw.filter(([, score]) => score >= scoreThreshold);

    return {
        docs: filtered.map(([doc]) => doc),
        scored: filtered.map(([doc, score]) => toSourceDoc(doc, score)),
    };
};

export async function* askToRagStream(options: RagStreamOptions): AsyncGenerator<StreamChunk> {
    const {
        question,
        topK = DEFAULTS.TOP_K,
        scoreThreshold = DEFAULTS.SCORE_THRESHOLD,
        conversationHistory = [],
    } = options;

    if (!question.trim()) {
        yield makeError("Question cannot be empty", "EMPTY_QUESTION");
        return;
    }

    // Retrieval phase
    yield { type: "retrieval_start" };

    let docs: Document[];
    let scoredDocs: SourceDoc[];

    try {
        ({ docs, scored: scoredDocs } = await retrieveDocs(question, topK, scoreThreshold));
    } catch (error) {
        console.error("[RAG] Retrieval error:", error);
        yield makeError("Failed to retrieve documents", "RETRIEVAL_FAILED");
        return;
    }

    if (docs.length === 0) {
        yield makeError("No relevant documents found", "NO_DOCS_FOUND");
        return;
    }

    yield { type: "retrieval_done", docCount: docs.length };

    // Context assembly - filter by scores instead of naive truncation
    let contextDocs = docs;
    let context = buildContext(contextDocs);

    if (context.length > DEFAULTS.MAX_CONTEXT_CHARS) {
        console.warn(
            `[RAG] Context too large (${context.length} chars), removing lowest-scoring documents...`,
        );
        
        // Sort by score descending and keep highest-scoring docs
        const docsWithScores = scoredDocs.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
        let trimmedContext = "";
        const trimmedDocs = [];

        for (const doc of docsWithScores) {
            const testContext = trimmedContext + (trimmedContext ? DOC_SEPARATOR : "") + `[${trimmedDocs.length + 1}] ${doc.pageContent.trim()}`;
            if (testContext.length > DEFAULTS.MAX_CONTEXT_CHARS) break;
            trimmedContext = testContext;
            trimmedDocs.push(doc);
        }

        context = trimmedContext;
        contextDocs = trimmedDocs.map((d) => ({ pageContent: d.pageContent, metadata: d.metadata } as Document));
        
        console.log(
            `[RAG] Context reduced: ${scoredDocs.length} → ${contextDocs.length} docs, ${buildContext(docs).length} → ${context.length} chars`,
        );
    }

    // LLM streaming phase
    try {
        const stream = await openai.chat.completions.create({
            model: DEFAULTS.MODEL,
            stream: true,
            temperature: DEFAULTS.TEMPERATURE,
            max_completion_tokens: DEFAULTS.MAX_TOKENS,
            messages: buildMessages(context, question, conversationHistory),
        });

        for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta.content;
            if (token) {
                yield { type: "token", token };
            }

            const finishReason = chunk.choices[0]?.finish_reason;
            if (finishReason && finishReason !== "stop") {
                console.warn(`[RAG] Stream ended with reason: ${finishReason}`);
            }
        }
    } catch (error) {
        console.error("[RAG] LLM error:", error);
        yield makeError("LLM generation failed", "LLM_FAILED");
        return;
    }

    yield { type: "done", docs: scoredDocs };
}
