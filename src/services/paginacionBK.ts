import puppeteer from "puppeteer";

const BASE_URL = "https://www.infocasas.com.py/venta/inmuebles/asuncion";
const START_PAGE = 1;
const END_PAGE = 3;

const main = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

  let currentPage = 1;

  // Navega a la página inicial si hace falta
  while (currentPage < START_PAGE) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Espera el paginador
    await page.waitForSelector("ul.search-results-pagination", { timeout: 10000 });
    const prevPageNum = await page.$eval(
      'ul.search-results-pagination li.ant-pagination-item-active',
      (el) => el.textContent?.trim()
    );
    await page.click(
      "ul.search-results-pagination li:last-child a.ant-pagination-item-link"
    );
    // Espera que vuelva a aparecer el paginador antes de comparar el número activo
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
    currentPage++;
  }

  // Scrapeo paginado
  while (currentPage <= END_PAGE) {
    try {
      await page.waitForSelector(
        "div.search-results-content section > div a",
        { timeout: 10000 }
      );
    } catch (err) {
      console.warn(`⚠️ Fallo al cargar página ${currentPage}:`, err);
      break;
    }

    const propertyUrls: string[] = await page.evaluate(() => {
      const anchors = document.querySelectorAll(
        "div.search-results-content section > div a"
      );
      return Array.from(anchors).map(
        (a) => (a as HTMLAnchorElement).href
      );
    });

    console.log(
      `Página ${currentPage} — ${propertyUrls.length} enlaces encontrados`
    );
    console.log(propertyUrls.slice(0, 3));

    // Click en siguiente si corresponde
    if (currentPage < END_PAGE) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForSelector("ul.search-results-pagination", { timeout: 10000 });
      const prevPageNum = await page.$eval(
        'ul.search-results-pagination li.ant-pagination-item-active',
        (el) => el.textContent?.trim()
      );
      // Haz click en ">"
      await page.click(
        "ul.search-results-pagination li:last-child a.ant-pagination-item-link"
      );
      // Espera paginador y cambio de número activo
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

  await browser.close();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
