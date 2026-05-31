import { Redis } from "ioredis";
import { env } from "./env.config";

const redis = new Redis({
    host: env.VALKEY_HOST || "localhost",
    port: env.VALKEY_PORT,
    maxRetriesPerRequest: null,
});

redis.on("connect", () => console.log("🐰Redis connected"));
redis.on("error", (error) => console.error("😔Redis connection error:", error));

export default redis;
