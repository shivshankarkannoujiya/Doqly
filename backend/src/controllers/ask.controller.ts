import type { Request, Response } from "express";
import { askToRagStream } from "../services/rag.service";
import { parseStringQuery, parseIntQuery } from "../validators/ingest.validator";

export const askQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        const question = parseStringQuery(req.query.question, "question");
        const topK = parseIntQuery(req.query.topK, "topK");

        // SSE headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        res.flushHeaders();

        const stream = askToRagStream({ question, topK });

        for await (const chunk of stream) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);

            if (chunk.type === "done" || chunk.type === "error") break;
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Stream failed";
        if (!res.headersSent) {
            res.status(500).json({ error: message });
        } else {
            res.write(
                `data: ${JSON.stringify({ type: "error", message, code: "STREAM_FAILED" })}\n\n`,
            );
        }
    } finally {
        res.end();
    }
};
