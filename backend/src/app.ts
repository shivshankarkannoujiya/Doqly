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

export default app;
