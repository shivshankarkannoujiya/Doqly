import type { Document } from "@langchain/core/documents";
import type { ErrorCode, StreamChunk, SourceDoc, Message } from "../types/rag.types";
import { DOC_SEPARATOR } from "./constant";
import { composeSystemPrompt } from "../prompts/rag.prompt";

const makeError = (message: string, code: ErrorCode): Extract<StreamChunk, { type: "error" }> => {
    return { type: "error", message, code };
};

const toSourceDoc = (doc: Document, score?: number): SourceDoc => {
    return {
        pageContent: doc.pageContent,
        metadata: doc.metadata ?? {},
        ...(score !== undefined && { score }),
    };
};

const buildContext = (docs: Document[]): string => {
    return docs.map((d, i) => `[${i + 1}] ${d.pageContent.trim()}`).join(DOC_SEPARATOR);
};

const buildMessages = (context: string, question: string, history: Message[] = []) => {
    return [
        { role: "system" as const, content: composeSystemPrompt(context) },
        ...history,
        { role: "user" as const, content: question },
    ];
};

export { makeError, toSourceDoc, buildContext, buildMessages };
