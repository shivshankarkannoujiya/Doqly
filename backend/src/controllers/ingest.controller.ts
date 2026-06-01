import type { Request, Response } from "express";
import { pdfQueue } from "../queues/pdf.queue";

export const ingestPdf = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        const fileUrl = `${req.protocol}://${req.get("host")}/static/pdfs/${req.file.filename}`;

        const job = await pdfQueue.add(
            "process-pdf",
            JSON.stringify({
                filename: req.file.originalname,
                destination: req.file.destination,
                path: req.file.path,
                fileUrl,
            }),
        );

        res.status(202).json({
            message: "Uploaded and queued for processing",
            jobId: job.id,
            fileUrl,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Ingest failed";
        res.status(400).json({ error: message });
    }
};
