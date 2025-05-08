import { Request, Response } from "express";
import { scrapeMultiplePages } from "../services/scraping.service";
import { SearchParams } from "../types/generalTypes";
import { ScrapigUrl } from "../types/URLs";




export const startScraping = async (req: Request, res: Response) => {
  try {
    const start = parseInt(req.query.start as string) || 2;
    const end = parseInt(req.query.end as string) || 2;

    const body = req.body;

    const serviceParams: SearchParams = body;

    const searchParams: ScrapigUrl = new ScrapigUrl(serviceParams.tranType,serviceParams.city, serviceParams.departamento,serviceParams.propType);
    

    const props = await scrapeMultiplePages(start, end, searchParams);

    res.json({ message: "Scraping e inserción completados", total: props.length });
  } catch (error) {
    console.error("❌ Error en el scraping:", error);
    res.status(500).json({ error: "Error en el scraping" });
  }
};

