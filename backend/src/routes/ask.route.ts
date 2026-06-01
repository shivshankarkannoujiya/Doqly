import { Router } from "express";
import { askQuestion } from "../controllers/ask.controller";

const router = Router();

router.route("/").post(askQuestion);

export default router;
