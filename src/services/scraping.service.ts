import puppeteer from "puppeteer";
import prisma from "../prisma"; // al inicio del archivo


interface PropertyData {
  titulo: string;
  precio: number;
  zona?: string;
  dormitorios?: number;
  banos?: number;
  tipo_propiedad?: string;
  estado_propiedad?: string;
  garajes?: number;
  m2_edificados?: number;
  m2_terreno?: number;
  plantas?: number;
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  url?: string;
  comodidades?: string;
  currency?: string;
}

export const scrapeMultiplePages = async (
  startPage: number = 2,
  endPage: number = 2
): Promise<PropertyData[]> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const results: PropertyData[] = [];

  for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
    const listUrl = `https://www.infocasas.com.py/venta/casas/asuncion/pagina${pageNum}?&ordenListado=3`;
    console.log(`🌐 Visitando página: ${listUrl}`);

    await page.goto(listUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("div.search-results-content section > div a", {
      timeout: 10000,
    });

    const propertyUrls: string[] = await page.evaluate(() => {
      const anchors = document.querySelectorAll(
        "div.search-results-content section > div a"
      );
      return Array.from(anchors).map((a) => (a as HTMLAnchorElement).href);
    });

    console.log(`🔗 ${propertyUrls.length} enlaces encontrados`);


    for (const propertyUrl of propertyUrls) {
      try {
        console.log(`🏠 Scrapeando: ${propertyUrl}`);
        await page.goto(propertyUrl, { waitUntil: "domcontentloaded" });

        const rawJson = await page.$eval(
          "#__NEXT_DATA__",
          (el) => el.textContent
        );
        const parsed = JSON.parse(rawJson || "");
        const apollo = parsed.props.pageProps.apolloState;

        const propKey = Object.keys(apollo).find((k) =>
          k.startsWith("Property:")
        );
        if (!propKey) continue;

        const property = apollo[propKey];
        const facilities = property.facilities || [];

        const data: PropertyData = {
          titulo: property.title,
          precio: property.price?.amount || 0,
          zona: property.neighborhood?.name,
          dormitorios: parseInt(property.bedrooms) || undefined,
          banos: parseInt(property.bathrooms) || undefined,
          tipo_propiedad: property.property_type?.name,
          estado_propiedad: property.technicalSheet?.find(
            (x: any) => x.field === "construction_state_name"
          )?.value,
          garajes: parseInt(property.garage) || undefined,
          m2_edificados: parseFloat(property.m2Built) || undefined,
          m2_terreno: parseFloat(property.m2Terrain) || undefined,
          plantas: parseInt(property.story) || undefined,
          descripcion: property.description?.replace(/<[^>]+>/g, ""),
          latitud: property.latitude,
          longitud: property.longitude,
          url: `https://www.infocasas.com.py/${property.link}`,
          comodidades: facilities
            .map((f: any) => apollo[f.__ref]?.name)
            .join(", "),
          currency: property.price?.currency?.name || "Gs.",
        };

        await prisma.propiedades_scraping.create({
          data: {
            ...data,
            fecha_scraping: new Date(),
          },
        });
        console.log(`✅ Guardado: ${data.titulo}`);
        
      } catch (error) {
        console.error("❌ Error scrapeando:", propertyUrl, error);
      }
    }
  }

  await browser.close();
  return results;
};
