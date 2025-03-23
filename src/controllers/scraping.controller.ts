import { Request, Response } from "express";
import { scrapeProperties } from "../services/scraping.service";
import prisma from "../prisma";

export const startScraping = async (req: Request, res: Response) => {
  try {
    const properties = await scrapeProperties();

    for (const prop of properties) {
      await prisma.propiedades_scraping.create({
        data: {
          titulo: prop.titulo,
          precio: parseFloat(prop.precio.replace(/[^0-9.]/g, "")) || 0,
          url: prop.url,
        },
      });
    }

    res.json({ message: "Scraping completado", properties });
  } catch (error) {
    console.error("Error en scraping:", error);
    res.status(500).json({ error: "Error en scraping" });
  }
};
