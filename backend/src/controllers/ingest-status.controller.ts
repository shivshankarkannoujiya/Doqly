import type { Request, Response } from "express";
import { pdfQueue } from "../queues/pdf.queue.js";
import { parseJobData } from "../validators/pdf.job.validator.js";

type JobStatus = "waiting" | "active" | "completed" | "failed" | "delayed" | "unknown";

export const getIngestStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { jobId } = req.params;

        if (typeof jobId !== "string" || !jobId.trim()) {
            res.status(400).json({ error: "jobId is required" });
            return;
        }

        const job = await pdfQueue.getJob(jobId);

        if (!job) {
            res.status(404).json({ error: `Job ${jobId} not found` });
            return;
        }

        const state = (await job.getState()) as JobStatus;
        const progress = job.progress;
        const failedReason = job.failedReason ?? null;

        const data = parseJobData(job.data);

        res.status(200).json({
            jobId: job.id,
            status: state,
            progress,
            filename: data.filename ?? null,
            ...(failedReason && { error: failedReason }),
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to get job status";
        res.status(500).json({ error: message });
    }
};
