export const assertFileUploaded = (
    file: Express.Multer.File | undefined,
): asserts file is Express.Multer.File => {
    if (!file) {
        throw new Error("No file uploaded");
    }

    if (file.mimetype !== "application/pdf") {
        throw new Error("Only PDF files are accepted");
    }
};

export const assertQuestion = (question: unknown): asserts question is string => {
    if (typeof question !== "string" || !question.trim()) {
        throw new Error("Question must be a non-empty string");
    }
};

export const parseStringQuery = (value: unknown, fieldName: string): string => {
    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`${fieldName} must be a non-empty string`);
    }
    return value.trim();
};

export const parseIntQuery = (value: unknown, fieldName: string): number | undefined => {
    if (value === undefined) return undefined;
    if (typeof value !== "string") {
        throw new Error(`${fieldName} must be a string`);
    }
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) throw new Error(`${fieldName} must be a valid number`);
    return parsed;
};
