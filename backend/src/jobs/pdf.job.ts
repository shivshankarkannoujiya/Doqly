import { Job } from "bullmq";
import { parseJobData } from "../validators/pdf.job.validator";
import {
    resolveAbsolutePath,
    assertFileExists,
    loadPdf,
    chunkDocs,
    enrichMetadata,
    deleteFile,
} from "../services/pdf.service";
import { addChunks } from "../services/qdrant.service";

export const processPdfJob = async (job: Job): Promise<void> => {
    console.log(`🔥 Processing Job ${job.id}`);
    const data = parseJobData(job.data);
    const absolutePath = resolveAbsolutePath(data.path);

    assertFileExists(absolutePath);
    await job.updateProgress(10);

    const rawDocs = await loadPdf(absolutePath);
    console.info(`[Job ${job.id}] Loaded ${rawDocs.length} pages from "${data.filename}"`);
    await job.updateProgress(30);

    const chunks = await chunkDocs(rawDocs);
    const enrichedChunks = enrichMetadata(chunks, data);
    console.info(`[Job ${job.id}] Created ${enrichedChunks.length} chunks`);
    await job.updateProgress(50);

    await addChunks(enrichedChunks, (batchNum, totalBatches) => {
        const progress = 50 + Math.round((batchNum / totalBatches) * 45);
        job.updateProgress(progress);
        console.info(`[Job ${job.id}] Batch ${batchNum}/${totalBatches} embedded`);
    });

    await job.updateProgress(100);
    deleteFile(absolutePath);
};
