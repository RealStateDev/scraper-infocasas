// routes/scraping.routes.ts
import { Router } from "express";
import { startFullScraping } from "../controllers/scraping.controller";
const router = Router();

router.post("/scrapear-infocasas", startFullScraping);

export default router;
