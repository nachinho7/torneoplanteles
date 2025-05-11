const express = require("express");
const playwright = require("playwright");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3001;

const TORNEOS = require("../src/data/torneos");

const urls = [
  { id: "2025001", division: "Superior" },
  { id: "2025002", division: "Intermedia" },
  { id: "2025003", division: "Preintermedia A" },
  { id: "2025004", division: "Preintermedia B" },
  { id: "2025005", division: "Preintermedia C" },
  { id: "2025006", division: "Preintermedia D" },
];

// Limpieza de nombres
const limpiarNombre = (nombre) => {
  if (!nombre) return null;
  const limpio = nombre.trim().toUpperCase();
  return limpio.replace(/\s+[A-Z]$/, ""); // Elimina sufijos tipo " A", " B"
};

// Lanzar navegador
const lanzarBrowser = async () => {
  return await playwright.chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });
};

// Scrapear tabla individual
const scrapearTabla = async (page, url, division) => {
  try {
    const fullUrl = `https://fixture.urba.org.ar/table?id=${url}`;
    console.log("Cargando:", division, fullUrl);
    await page.goto(fullUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("div[class^='styles_teams__']", { timeout: 15000 });

    const equipos = await page.$$eval("div[class^='styles_teams__']", (rows) => {
      return rows.map((row) => {
        const nombre = row.querySelector("div[class^='styles_teamWrapper__']")?.innerText.trim();
        const valores = Array.from(row.querySelectorAll("div[class^='styles_right__'] h6"))
          .map(el => parseInt(el.innerText.trim()) || 0);

        return {
          nombre: nombre || null,
          jugados: valores[0] || 0,
          ganados: valores[1] || 0,
          empatados: valores[2] || 0,
          perdidos: valores[3] || 0,
          puntosFavor: valores[4] || 0,
          puntosContra: valores[5] || 0,
          diferencia: valores[6] || 0,
        };
      });
    });

    return equipos.map(e => ({ ...e, division }));
  } catch (error) {
    console.error("❌ Error en", url, "→", error.message);
    return [];
  }
};

// Ruta principal agrupada por equipo y división
app.get("/api/por-equipo/:torneo", async (req, res) => {
  const { torneo } = req.params;
  const urls = TORNEOS[torneo];
  if (!urls) return res.status(404).json({ error: "Torneo no encontrado" });

  const browser = await lanzarBrowser();
  const page = await browser.newPage();
  const resultado = {};

  for (const { id, division } of urls) {
    const tabla = await scrapearTabla(page, id, division);
    for (const equipo of tabla) {
      const nombreLimpio = limpiarNombre(equipo.nombre);
      if (!nombreLimpio || equipo.jugados === 0) continue;

      if (!resultado[nombreLimpio]) resultado[nombreLimpio] = [];

      resultado[nombreLimpio].push({
        division: equipo.division,
        jugados: equipo.jugados,
        ganados: equipo.ganados,
        empatados: equipo.empatados,
        perdidos: equipo.perdidos,
      });
    }
  }

  await browser.close();
  res.json(resultado);
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor agrupado por equipo en http://localhost:${PORT}/api/por-equipo`);
});
