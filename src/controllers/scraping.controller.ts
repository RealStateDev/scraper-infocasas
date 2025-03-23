import { Request, Response } from "express";
import { scrapeMultiplePages } from "../services/scraping.service";

export const startScraping = async (req: Request, res: Response) => {
  try {
    const start = parseInt(req.query.start as string) || 2;
    const end = parseInt(req.query.end as string) || 2;

    const props = await scrapeMultiplePages(start, end);

    res.json({ message: "Scraping e inserción completados", total: props.length });
  } catch (error) {
    console.error("❌ Error en el scraping:", error);
    res.status(500).json({ error: "Error en el scraping" });
  }
};

