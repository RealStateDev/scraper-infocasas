import puppeteer from "puppeteer";
import prisma from "../prisma";
import { PropertyData } from "../types/generalTypes";
import { ScrapigUrl } from "../types/URLs";
import { TransactionType, PropertyType, CityList, DepartamentoList} from "../types/generalTypes";

export const scrapeAllPagesAndSave = async (endPage = 3, tranType: TransactionType, propType: PropertyType, city: CityList, departamento: DepartamentoList) => {

  const URL = new ScrapigUrl(tranType, city, departamento, propType).getUrl;
  console.log("URL",URL);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(URL,{waitUntil: "domcontentloaded"});

  let currentPage = 1;
  const allPropertyUrls: Set<string> = new Set();

  while (currentPage <= endPage) {
    try {
      await page.waitForSelector("div.search-results-content section > div a", { timeout: 10000 });
    } catch (err) {
      console.warn(`⚠️ Fallo al cargar página ${currentPage}:`, err);
      break;
    }

    const propertyUrls: string[] = await page.evaluate(() => {
      const anchors = document.querySelectorAll(
        "div.search-results-content section > div a"
      );
      return Array.from(anchors).map((a) => (a as HTMLAnchorElement).href);
    });

    propertyUrls.forEach(url => allPropertyUrls.add(url));

    // Next Page
  
    if (currentPage < endPage) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForSelector("ul.search-results-pagination", { timeout: 10000 });
      const prevPageNum = await page.$eval(
        'ul.search-results-pagination li.ant-pagination-item-active',
        (el) => el.textContent?.trim()
      );
      await page.click(
        "ul.search-results-pagination li:last-child a.ant-pagination-item-link"
      );
      await page.waitForSelector("ul.search-results-pagination", { timeout: 10000 });
      await page.waitForFunction(
        (prev) => {
          const active = document.querySelector(
            "ul.search-results-pagination li.ant-pagination-item-active"
          );
          return active && active.textContent?.trim() !== prev;
        },
        {},
        prevPageNum
      );
    }
    currentPage++;
  }

  for (const url of allPropertyUrls) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      const rawJson = await page.$eval("#__NEXT_DATA__", (el) => el.textContent);
      const parsed = JSON.parse(rawJson || "");
      const apollo = parsed.props.pageProps.apolloState;

      const propKey = Object.keys(apollo).find((k) => k.startsWith("Property:"));
      if (!propKey) continue;

      const property = apollo[propKey];
      const facilities = property.facilities || [];

      const getFromSheet = (field: string): string | undefined =>
        property.technicalSheet?.find((x: any) => x.field === field)?.value;

      const propType = getFromSheet("property_type_name") || property.property_type?.name;
      const esDepartamento = propType === "Departamento";
      const esCasa = propType === "Casa";
      const currency_ref = property.price?.currency?.__ref;
      const currencySymbol = currency_ref === "Currency:1" ? "U$S" : "Gs.";

      const data: PropertyData = {
        es_casa: esCasa,
        es_departamento: esDepartamento,
        titulo: property.title,
        precio: property.price?.amount || 0,
        zona: getFromSheet("neighborhood_name") || property.neighborhood?.name || "",
        dormitorios:
          parseInt(property.bedrooms) ||
          parseInt(getFromSheet("bedrooms") || "") ||
          undefined,
        banos:
          parseInt(property.bathrooms) ||
          parseInt(getFromSheet("bathrooms") || "") ||
          undefined,
        tipo_propiedad: propType,
        estado_propiedad: getFromSheet("construction_state_name"),
        garajes:
          parseInt(property.garage) ||
          parseInt(getFromSheet("garage") || "") ||
          undefined,
        m2_edificados:
          parseFloat(getFromSheet("m2Built")?.replace(/[^\d.]/g, "") || "") ||
          undefined,
        m2_terreno:
          parseFloat(getFromSheet("m2Terrain")?.replace(/[^\d.]/g, "") || "") ||
          undefined,
        plantas: parseInt(getFromSheet("story") || "") || undefined,
        descripcion: property.description?.replace(/<[^>]+>/g, ""),
        latitud: property.latitude,
        longitud: property.longitude,
        url: `https://www.infocasas.com.py/${property.link}`,
        comodidades: facilities.map((f: any) => apollo[f.__ref]?.name).join(", "),
        currency: currencySymbol,
        ciudad: city, 
        image_url: property.img || "no data",
        trans_type : tranType
      };

      await prisma.propiedades_scraping.create({
        data: {
          ...data,
          fecha_scraping: new Date(),
        },
      });

      console.log(`✅ Guardado: ${data.titulo}`);
    } catch (error) {
      console.error("❌ Error scrapeando (se omite y sigue):", url, error);
    }
  }

  await browser.close();
};
