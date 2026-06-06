import type { Document } from "@langchain/core/documents";

export type StreamChunk =
    | { type: "retrieval_start" }
    | { type: "retrieval_done"; docCount: number }
    | { type: "token"; token: string }
    | { type: "done"; docs: SourceDoc[] }
    | { type: "error"; message: string; code: ErrorCode };

export interface RelevantDoc {
    pageContent: string;
    metadata: Record<string, unknown>;
}

export interface RagStreamOptions {
    question: string;
    topK?: number;
    scoreThreshold?: number;
    conversationHistory?: Message[];
}

export type Message = { role: "user" | "assistant"; content: string };

interface SourceMetadata {
    source?: string;
    fileUrl?: string;
    chunkIndex?: number;
    totalChunks?: number;
    loc?: {
        pageNumber?: number;
    };
}

export interface SourceDoc {
    pageContent: string;
    metadata: SourceMetadata;
    score?: number;
}

export type ErrorCode =
    | "EMPTY_QUESTION"
    | "NO_DOCS_FOUND"
    | "RETRIEVAL_FAILED"
    | "LLM_FAILED"
    | "CONTEXT_TOO_LARGE";

export type RetrievedDocument = Document;
