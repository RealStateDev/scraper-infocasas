// controllers/scraping.controller.ts
import { Request, Response } from "express";
import { scrapeAllPagesAndSave } from "../services/scraping.service";

export const startFullScraping = async (req: Request, res: Response) => {
  const { endPage, tranType, propType, city, departamento} = req.body;

  scrapeAllPagesAndSave(endPage,tranType, propType, city,departamento)
    .then(() => console.log("Scraping corriendo en el backend"))
    .catch((err) => console.error("Error scraping:", err));

  res.status(202).json({ message: "Scraping iniciado. Scraping corriendo en el backend." });
};
