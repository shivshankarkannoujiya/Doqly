import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings.service";
import { env } from "../config/env.config";

let vectorStore: QdrantVectorStore | null = null;

export const getVectorStore = async () => {
    if (vectorStore) {
        return vectorStore;
    }

    vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: env.QDRANT_URL,
        collectionName: env.QDRANT_COLLECTION_NAME ?? "pdf-docs",
    });

    return vectorStore;
};


