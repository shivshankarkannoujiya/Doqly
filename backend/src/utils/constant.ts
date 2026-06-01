export const DEFAULTS = {
    TOP_K: 4,
    TEMPERATURE: 0.2,
    MAX_TOKENS: 1024,
    MODEL: "gpt-4o-mini",
    SCORE_THRESHOLD: 0.0,
    MAX_CONTEXT_CHARS: 12_000,
} as const;

export const DOC_SEPARATOR = "\n\n---\n\n";
