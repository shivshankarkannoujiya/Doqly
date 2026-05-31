import { Queue } from "bullmq";
import redis from "../config/redis.config";

export const pdfQueue = new Queue("pdf-processing", {
    connection: redis
});