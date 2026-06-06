export const DEFAULTS = {
    TOP_K: 4,
    TEMPERATURE: 0.2,
    MAX_TOKENS: 1024,
    MODEL: "gpt-4o-mini",
    SCORE_THRESHOLD: 0,
    MAX_CONTEXT_CHARS: 12_000,
} as const;

export const DOC_SEPARATOR = "\n\n---\n\n";

export const CHUNKING = {
    chunkSize: 1000,
    chunkOverlap: 200,
} as const;

export const QDRANT = {
    collectionName: "pdf-docs",
} as const;

export const WORKER = {
    concurrency: 3,
    batchSize: 100,
} as const;


