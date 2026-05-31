import { OpenAIEmbeddings } from "@langchain/openai";
import { env } from "../config/env.config";

export const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: env.OPENAI_API_KEY,
});
