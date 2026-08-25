#!/usr/bin/env node
// Prerenderizado estático (no SSR) de las rutas PÚBLICAS de la SPA.
//
// Por qué existe: la app es 100% client-side rendered (Vite/React). El
// index.html que sirve Vercel para cualquier ruta es un shell vacío
// (<div id="root"></div> + <script>) — cualquier cliente que no ejecute
// JavaScript (crawlers, agentes de IA que hacen fetch en vez de abrir un
// navegador real, sistemas de inspección externos) recibe ese shell vacío
// y no puede leer ni recorrer el contenido, aunque el servidor, el bundle
// JS y el CSS respondan perfectamente. Un navegador real o headless que sí
// ejecuta JS renderiza todo sin problema (ver App.jsx: el sitio funciona
// con o sin sesión de Supabase).
//
// Este script corre UNA vez en build time (no en cada request, no hay
// servidor Node en producción): levanta el build ya generado con `vite
// preview`, abre cada ruta pública con un Chromium headless real (mismo
// motor que ya probamos que renderiza correctamente), espera a que React
// termine de pintar, y guarda el HTML resultante como archivo estático en
// dist/<ruta>/index.html. Los usuarios reales no notan ningún cambio: ese
// HTML solo sirve de primer pintado, y main.jsx hidrata sobre él exactamente
// igual que hoy hidrata sobre el shell vacío.
//
// Deliberadamente NO se prerenderiza /bolsa (Bolsa de Casos): es contenido
// privado de staff (profesional_icbf/admin), sus datos ya vienen protegidos
// por RLS y sin sesión no hay nada público que capturar — se deja como
// shell CSR normal, igual que hoy.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { ETAPAS } from '../src/data/etapas.js';

const PORT = 4174;
const BASE_URL = `http://localhost:${PORT}`;
const DIST_DIR = path.resolve(import.meta.dirname, '..', 'dist');

const RUTAS_PUBLICAS = [
  '/',
  '/herramientas',
  '/perfil',
  ...ETAPAS.map((etapa) => `/etapa/${etapa.code}`),
];

async function destinoParaRuta(ruta) {
  if (ruta === '/') return path.join(DIST_DIR, 'index.html');
  return path.join(DIST_DIR, ruta.replace(/^\//, ''), 'index.html');
}

async function main() {
  const previewServer = await preview({
    root: path.resolve(import.meta.dirname, '..'),
    preview: { port: PORT, strictPort: true },
  });

  try {
    const browser = await puppeteer.launch({ headless: true });
    try {
      for (const ruta of RUTAS_PUBLICAS) {
        const page = await browser.newPage();
        await page.goto(`${BASE_URL}${ruta}`, { waitUntil: 'networkidle0' });
        // La Home (etapa 01) y las demás etapas tardan un tick extra en
        // pintar su contenido tras el mount inicial de React — esperamos a
        // que <main> tenga contenido real antes de capturar.
        await page.waitForFunction(() => document.querySelector('main')?.textContent.trim().length > 0);
        const html = await page.content();
        await page.close();

        const destino = await destinoParaRuta(ruta);
        await mkdir(path.dirname(destino), { recursive: true });
        await writeFile(destino, html, 'utf-8');
        console.log(`[prerender] ${ruta} -> ${path.relative(DIST_DIR, destino)}`);
      }
    } finally {
      await browser.close();
    }
  } finally {
    await new Promise((resolve) => previewServer.httpServer.close(resolve));
  }
}

main().catch((err) => {
  console.error('[prerender] Falló el prerenderizado:', err);
  process.exit(1);
});
