import { openai } from "./openai.service";
import { getVectorStore } from "./qdrant.service";
import { composeSystemPrompt } from "../prompts/rag.prompt";
import type { Document } from "@langchain/core/documents";
import type { RagStreamOptions, StreamChunk } from "../types/rag.types";

export async function* askToRagStream(options: RagStreamOptions): AsyncGenerator<StreamChunk> {
    const { question, topK = 4 } = options;

    if (!question.trim()) {
        yield {
            type: "error",
            message: "Question cannot be empty",
        };
        return;
    }

    let docs: Document[];

    try {
        const store = await getVectorStore();

        const retriever = store.asRetriever({
            k: topK,
        });

        docs = await retriever.invoke(question);
    } catch (error) {
        yield {
            type: "error",
            message: "Failed to retrieve documents",
        };
        return;
    }

    const context = docs.map((doc) => doc.pageContent).join("\n\n---\n\n");

    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            stream: true,
            temperature: 0.2,
            max_tokens: 1024,
            messages: [
                {
                    role: "system",
                    content: composeSystemPrompt(context),
                },
                {
                    role: "user",
                    content: question,
                },
            ],
        });

        for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content;

            if (token) {
                yield {
                    type: "token",
                    token,
                };
            }
        }
    } catch {
        yield {
            type: "error",
            message: "LLM generation failed",
        };
        return;
    }

    yield {
        type: "done",
        docs: docs.map((doc) => ({
            pageContent: doc.pageContent,
            metadata: doc.metadata,
        })),
    };
}
