import puppeteer from "puppeteer";
import prisma from "../prisma"; // al inicio del archivo


interface PropertyData {
  es_casa: boolean;
  es_departamento: boolean;
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

        const getFromSheet = (field: string): string | undefined => {
          return property.technicalSheet?.find((x: any) => x.field === field)?.value;
        };

        //Comprobacion de valores Booleanos
          let esCasa = false;
          let esDepartamento = false;


          switch (getFromSheet("property_type_name") || property.property_type?.name) {
            case "Departamento":
               esCasa = false;
               esDepartamento = true;
              break;

            case "Casa":
               esCasa = true;
               esDepartamento = false;
              break;
          
            default:
              break;
          }
        //
        
        const data: PropertyData = {
          es_casa: esCasa,
          es_departamento: esDepartamento,
          titulo: property.title,
          precio: property.price?.amount || 0,
          zona: getFromSheet("neighborhood_name") || property.neighborhood?.name,
          dormitorios: parseInt(property.bedrooms) || parseInt(getFromSheet("bedrooms") || "") || undefined,
          banos: parseInt(property.bathrooms) || parseInt(getFromSheet("bathrooms") || "") || undefined,
          tipo_propiedad: getFromSheet("property_type_name") || property.property_type?.name,
          estado_propiedad: getFromSheet("construction_state_name"),
          garajes: parseInt(property.garage) || parseInt(getFromSheet("garage") || "") || undefined,
          m2_edificados: parseFloat(getFromSheet("m2Built")?.replace(/[^\d.]/g, "") || "") || undefined,
          m2_terreno: parseFloat(getFromSheet("m2Terrain")?.replace(/[^\d.]/g, "") || "") || undefined,
          plantas: parseInt(getFromSheet("story") || "") || undefined,
          descripcion: property.description?.replace(/<[^>]+>/g, ""),
          latitud: property.latitude,
          longitud: property.longitude,
          url: `https://www.infocasas.com.py/${property.link}`,
          comodidades: facilities.map((f: any) => apollo[f.__ref]?.name).join(", "),
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
