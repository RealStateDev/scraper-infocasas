import { Router } from "express";
import { startScraping } from "../controllers/scraping.controller";

const router = Router();

router.get("/start", startScraping);

export default router;
