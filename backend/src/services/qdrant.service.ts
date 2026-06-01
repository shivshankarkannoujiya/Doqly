import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings.service";
import { env } from "../config/env.config";
import { QDRANT, WORKER } from "../utils/constant";
import type { Document } from "langchain";

export const getVectorStore = (): Promise<QdrantVectorStore> => {
    return QdrantVectorStore.fromExistingCollection(embeddings, {
        url: env.QDRANT_URL,
        collectionName: QDRANT.collectionName,
    });
};

export const addChunks = async (
    chunks: Document[],
    onBatchComplete?: (batchNumber: number, totalBatches: number) => void,
): Promise<void> => {
    const vectorStore = await getVectorStore();
    const totalBatches = Math.ceil(chunks.length / WORKER.batchSize);

    for (let i = 0; i < chunks.length; i += WORKER.batchSize) {
        const batch = chunks.slice(i, i + WORKER.batchSize);
        await vectorStore.addDocuments(batch);

        const batchNumber = Math.ceil(i / WORKER.batchSize) + 1;
        onBatchComplete?.(batchNumber, totalBatches);
    }
};
