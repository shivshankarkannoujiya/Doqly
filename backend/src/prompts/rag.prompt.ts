export const composeSystemPrompt = (context: string): string => {
    return `
        You are a precise document assistant.
        Rules:
            1. Answer ONLY using the provided context.
            2. Never invent information.
            3. If answer is unavailable reply exactly:
            "Not found in document"
            4. Be concise and factual.

        Context:
        ${context}
    
    `.trim();
};
