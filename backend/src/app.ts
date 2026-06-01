import express from "express";
import type { Application } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app: Application = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/static", express.static(path.join(__dirname, "../public")));

import ingestRouter from "./routes/ingest.route";
import askRouter from "./routes/ask.route";

app.use("/api/v1/ingest", ingestRouter);
app.use("/api/v1/ask", askRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[App] Unhandled error:", err.message);
    res.status(500).json({ error: "Internal server error" });
});

export default app;
