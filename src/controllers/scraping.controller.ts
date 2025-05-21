// controllers/scraping.controller.ts
import { Request, Response } from "express";
import { scrapeAllPagesAndSave } from "../services/scraping.service";

export const startFullScraping = async (req: Request, res: Response) => {
  // Lee parámetros si querés, ej: ciudad, rango de páginas, etc.
  const { startPage = 1, endPage = 3 } = req.body;

  // Dispara el scraping en background SIN AWAIT
  scrapeAllPagesAndSave(startPage, endPage)
    .then(() => console.log("Scraping terminado."))
    .catch((err) => console.error("Error scraping:", err));

  // Responde rápido
  res.status(202).json({ message: "Scraping iniciado. El proceso sigue en background." });
};
