import fs from "fs";
import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import type { Document } from "@langchain/core/documents";
import { CHUNKING } from "../utils/constant";
import type { PdfJobData } from "../validators/pdf.job.validator";

export const resolveAbsolutePath = (relativePath: string): string => {
    return path.resolve(process.cwd(), relativePath.replace(/\\/g, "/"));
};

export const assertFileExists = (absolutePath: string): void => {
    if (!fs.existsSync(absolutePath)) {
        throw new Error(`PDF not found at path: ${absolutePath}`);
    }
};

export const loadPdf = async (absolutePath: string): Promise<Document[]> => {
    const loader = new PDFLoader(absolutePath);
    const docs = await loader.load();

    if (docs.length === 0) {
        throw new Error(`PDF loaded 0 pages: ${absolutePath}`);
    }

    return docs;
};

export const chunkDocs = async (docs: Document[]): Promise<Document[]> => {
    const splitter = new RecursiveCharacterTextSplitter(CHUNKING);
    return splitter.splitDocuments(docs);
};

export const enrichMetadata = (chunks: Document[], data: PdfJobData): Document[] => {
    return chunks.map((chunk, index) => ({
        ...chunk,
        metadata: {
            ...chunk.metadata,
            source: data.filename,
            fileUrl: data.fileUrl,
            chunkIndex: index,
            totalChunks: chunks.length,
            ingestedAt: new Date().toISOString(),
        },
    }));
};

export const deleteFile = (absolutePath: string): void => {
    try {
        fs.unlinkSync(absolutePath);
        console.info(`[PDF] Deleted file: ${absolutePath}`);
    } catch (error) {
        console.warn(`[PDF] Could not delete file: ${absolutePath}`, error);
    }
};
