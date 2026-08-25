// Enrutamiento manual con history.pushState — sin react-router, porque el
// espacio de rutas es chico y fijo (etapas, herramientas, perfil, bolsa,
// y qué formato está abierto). App.jsx es la única que consume esto: lee
// la URL al montar, la mantiene sincronizada con activeIndex/openFormat, y
// escucha popstate para que atrás/adelante del navegador funcione.
import { ETAPAS } from '../data/etapas.js';
import { AMBITOS } from '../data/ambitos.js';

export function activeIndexToPath(activeIndex) {
  if (activeIndex === 'herramientas') return '/herramientas';
  if (activeIndex === 'perfil') return '/perfil';
  if (activeIndex === 'bolsa') return '/bolsa';
  if (typeof activeIndex === 'number' && activeIndex >= 0) {
    const etapa = ETAPAS[activeIndex];
    return etapa ? `/etapa/${etapa.code}` : '/';
  }
  return '/';
}

export function pathToActiveIndex(pathname) {
  if (pathname === '/herramientas') return 'herramientas';
  if (pathname === '/perfil') return 'perfil';
  if (pathname === '/bolsa') return 'bolsa';
  const m = pathname.match(/^\/etapa\/(\d+)$/);
  if (m) {
    const idx = ETAPAS.findIndex((e) => e.code === m[1]);
    if (idx >= 0) return idx;
  }
  return -1;
}

// Reconstruye el objeto formato completo a partir de solo su código —
// hace falta al restaurar la URL (ej. al recargar con ?f=F7), porque en
// el resto de la app el objeto siempre llega ya resuelto desde
// FormatCard, nunca solo el código.
export function findFormatoByCodigo(codigo) {
  if (!codigo) return null;
  for (const etapa of ETAPAS) {
    const f = etapa.formatos.find((x) => x.codigo === codigo);
    if (f) return f;
  }
  for (const ambito of AMBITOS) {
    const h = ambito.herramientas.find((x) => x.codigo === codigo);
    if (h) return h;
  }
  return null;
}

export function buildUrl(activeIndex, formato) {
  const path = activeIndexToPath(activeIndex);
  return formato ? `${path}?f=${encodeURIComponent(formato.codigo)}` : path;
}

export function leerUbicacionActual() {
  const activeIndex = pathToActiveIndex(window.location.pathname);
  const formato = findFormatoByCodigo(new URLSearchParams(window.location.search).get('f'));
  return { activeIndex, formato };
}
