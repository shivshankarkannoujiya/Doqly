import { Router } from "express";
import { askQuestion } from "../controllers/ask.controller";

const router = Router();

router.route("/").get(askQuestion);

export default router;
