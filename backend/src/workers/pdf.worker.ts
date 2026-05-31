import fs from "fs";
import path from "path";
import redis from "../config/redis.config";
import { env } from "../config/env.config";
import { Worker } from "bullmq";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const pdfWorker = new Worker(
    "pdf-processing",
    async (job) => {
        const data = JSON.parse(job.data);
        const safeRelativePath = data.path.replace(/\\/g, "/");
        const absolutePath = path.join(process.cwd(), safeRelativePath);

        console.log("Reading file:", absolutePath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error("PDF file not found");
        }

        const loader = new PDFLoader(absolutePath);
        const docs = await loader.load();

        console.log("Pages loaded:", docs.length);

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 100,
        });

        console.log("SPLITTING...");
        const splitDocs = await splitter.splitDocuments(docs);
        console.log("Chunks created:", splitDocs.length);
        console.log("DONE...");

        const embedder = new OpenAIEmbeddings({
            model: "text-embedding-3-small",
            apiKey: env.OPENAI_API_KEY,
        });

        console.log("CREATING EMBEDDINGS & STORING INTO QDRANT...");
        const vectorStore = await QdrantVectorStore.fromDocuments(splitDocs, embedder, {
            url: env.QDRANT_URL,
            collectionName: "pdf-docs",
        });
        console.log("STORED SUCCESSFULLY");
    },
    {
        concurrency: 100,
        connection: redis,
    },
);

pdfWorker.on("completed", (job) => console.log(`Job ${job.id} completed`));
pdfWorker.on("failed", (job, err) => console.error(`Job ${job?.id} failed:`, err));

export default pdfWorker;
