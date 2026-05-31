import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().default(8000),
    VALKEY_HOST: z.string().default("localhost"),
    VALKEY_PORT: z.coerce.number().default(6379),
    OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
    QDRANT_URL: z.string().url("QDRANT_URL must be a valid URL"),
    QDRANT_COLLECTION_NAME: z.string()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(`Invalid environment variables`);
    process.exit(1);
}

export const env = parsed.data;
