import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { ingestPdf } from "../controllers/ingest.controller";
import { getIngestStatus } from "../controllers/ingest-status.controller";

const router = Router();

router.route("/").post(upload.single("file"), ingestPdf);
router.route("/:jobId").get(getIngestStatus);

export default router;
