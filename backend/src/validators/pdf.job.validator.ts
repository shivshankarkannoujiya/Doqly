export interface PdfJobData {
    filename: string;
    destination: string;
    path: string;
    fileUrl: string;
}

export const parseJobData = (raw: unknown): PdfJobData => {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;

    if (
        typeof data?.filename !== "string" ||
        typeof data?.path !== "string" ||
        typeof data?.fileUrl !== "string"
    ) {
        throw new Error(`Invalid job payload: ${JSON.stringify(data)}`);
    }

    return data as PdfJobData;
};
