import { openai } from "./openai.service";
import { buildContext, buildMessages, makeError, toSourceDoc } from "../utils/rag.utils";
import { getVectorStore } from "./qdrant.service";
import type { Document } from "@langchain/core/documents";
import type { RagStreamOptions, StreamChunk, SourceDoc } from "../types/rag.types";
import { DEFAULTS } from "../utils/constant";

const retrieveDocs = async (
    question: string,
    topK: number,
    scoreThreshold: number,
): Promise<{ docs: Document[]; scored: SourceDoc[] }> => {
    const store = await getVectorStore();

    const raw: Array<[Document, number]> = await store
        .similaritySearchWithScore(question, topK)
        .catch(() =>
            store
                .asRetriever({ k: topK })
                .invoke(question)
                .then((docs) => docs.map((d) => [d, 1] as [Document, number])),
        );

    const filtered = raw.filter(([, score]) => score >= scoreThreshold);

    // Remove duplicate chunks
    const uniqueChunks = Array.from(
        new Map(
            filtered.map(([doc, score]) => [
                `${doc.metadata.source}-${(doc.metadata.loc as { pageNumber?: number })?.pageNumber}-${doc.pageContent}`,
                [doc, score] as [Document, number],
            ]),
        ).values(),
    );

    if (uniqueChunks.length === 0) {
        return {
            docs: [],
            scored: [],
        };
    }

    // Convert to SourceDoc
    const scoredDocs = uniqueChunks.map(([doc, score]) => toSourceDoc(doc, score));

    // Remove duplicate citations 
    const uniqueSources = Array.from(
        new Map(
            scoredDocs.map((doc) => {
                const pageNumber = (doc.metadata.loc as { pageNumber?: number })?.pageNumber;

                return [`${doc.metadata.source ?? ""}-${pageNumber ?? 0}`, doc];
            }),
        ).values(),
    );

    return {
        docs: uniqueChunks.map(([doc]) => doc),
        scored: uniqueSources,
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
        yield makeError(
            "This information is not present in the uploaded document.",
            "NO_DOCS_FOUND",
        );

        return;
    }

    yield {
        type: "retrieval_done",
        docCount: docs.length,
    };

    // Build context
    let context = buildContext(docs);

    if (context.length > DEFAULTS.MAX_CONTEXT_CHARS) {
        console.warn(
            `[RAG] Context truncated: ${context.length} → ${DEFAULTS.MAX_CONTEXT_CHARS} chars`,
        );

        context = context.slice(0, DEFAULTS.MAX_CONTEXT_CHARS);
    }

    // LLM streaming
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
                yield {
                    type: "token",
                    token,
                };
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

    // Remove duplicate citations (same page)
    const uniqueSources = Array.from(
        new Map(
            scoredDocs.map((doc) => [
                `${doc.metadata.source ?? ""}-${doc.metadata.loc?.pageNumber ?? 0}`,
                doc,
            ]),
        ).values(),
    );

    const sortedSources = uniqueSources.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    yield {
        type: "done",
        docs: sortedSources,
    };
}
