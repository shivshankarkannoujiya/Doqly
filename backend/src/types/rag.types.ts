import type { Document } from "@langchain/core/documents";

export type StreamChunk =
    | { type: "token"; token: string }
    | { type: "done"; docs: RelevantDoc[] }
    | { type: "error"; message: string };

export interface RelevantDoc {
    pageContent: string;
    metadata: Record<string, unknown>;
}

export interface RagStreamOptions {
    question: string;
    topK?: number;
    scoreThreshold?: number;
}

export type RetrievedDocument = Document;
