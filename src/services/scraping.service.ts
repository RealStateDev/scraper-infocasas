import puppeteer from "puppeteer";

export const scrapeProperties = async () => {
  const browser = await puppeteer.launch({ headless: true }); // Cambia a false si quieres ver la navegación
  const page = await browser.newPage();

  console.log("🔍 Accediendo a Infocasas...");
  await page.goto("https://www.infocasas.com.py/venta/casas-y-departamentos/pagina2", {
    waitUntil: "domcontentloaded",
  });

  // Seleccionar todas las propiedades de la página
  const properties = await page.evaluate(() => {
    const items = document.querySelectorAll(".contenedor-propiedades .contenedor-propiedad");

    return Array.from(items).map((item) => {
      const titulo = item.querySelector(".titulo-propiedad")?.textContent?.trim() || "Sin título";
      const precio = item.querySelector(".precio-propiedad")?.textContent?.trim() || "0";
      const url = item.querySelector("a")?.getAttribute("href") || "#";

      return { titulo, precio, url };
    });
  });

  console.log(`✅ ${properties.length} propiedades extraídas.`);
  await browser.close();

  return properties;
};
//ejmplo de selector de titulo de dos propiedades
//*[@id="__next"]/div[2]/div[2]/section/div[1]/div/div/div/a/div[3]/h2/span
//*[@id="__next"]/div[2]/div[2]/section/div[2]/div/div/div/a/div[3]/h2/span

//De precio
//*[@id="__next"]/div[2]/div[2]/section/div[1]/div/div/div/a/div[1]/div/strong
//*[@id="__next"]/div[2]/div[2]/section/div[2]/div/div/div/a/div[1]/div/strong

