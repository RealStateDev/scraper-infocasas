import puppeteer from "puppeteer";

const BASE_URL = "https://www.infocasas.com.py/venta/inmuebles/central/luque?&ordenListado=3";
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
  const allPropertyUrls: Set<string> = new Set();

  while (currentPage < START_PAGE) {
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
    currentPage++;
  }

  // Loop de paginado y scraping de links
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
      return Array.from(anchors).map((a) => (a as HTMLAnchorElement).href);
    });

    // Imprime todos los enlaces de la página actual
    console.log(`\n===== Página ${currentPage} — ${propertyUrls.length} enlaces encontrados =====`);
    propertyUrls.forEach((url, idx) => console.log(`${idx + 1}: ${url}`));

    propertyUrls.forEach(url => allPropertyUrls.add(url));

    console.log(`Total acumulado hasta ahora: ${allPropertyUrls.size}`);

    // Click en siguiente si corresponde
    if (currentPage < END_PAGE) {
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

  // --- Al final, imprime el total de enlaces únicos encontrados ---
  console.log("\n=== TOTAL DE LINKS ÚNICOS ENCONTRADOS ===");
  Array.from(allPropertyUrls).forEach((url, i) => console.log(i + 1, url));
  console.log(`\nTotal enlaces únicos encontrados: ${allPropertyUrls.size}`);

  await browser.close();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
