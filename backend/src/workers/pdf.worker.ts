import redis from "../config/redis.config";
import { Worker } from "bullmq";
import { processPdfJob } from "../jobs/pdf.job";
import { WORKER } from "../utils/constant";

const pdfWorker = new Worker("pdf-processing", processPdfJob, {
    concurrency: WORKER.concurrency,
    connection: redis,
});

pdfWorker.on("completed", (job) => console.info(`[Job ${job.id}] ✓ Completed`));
pdfWorker.on("failed", (job, err) => console.error(`[Job ${job?.id}] ✗ Failed: ${err.message}`));
pdfWorker.on("progress", (job, progress) => console.info(`[Job ${job.id}] Progress: ${progress}%`));

export default pdfWorker;
