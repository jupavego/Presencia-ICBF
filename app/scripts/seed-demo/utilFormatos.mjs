// Helpers compartidos por los generadores de formatos oficiales (formatos.mjs, f5.mjs).
export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function pickN(arr, n) {
  const copia = [...arr].sort(() => Math.random() - 0.5);
  return copia.slice(0, Math.min(n, copia.length));
}

export function pickAlgunos(arr, min, max) {
  const n = min + Math.floor(Math.random() * (max - min + 1));
  return pickN(arr, n);
}

// DD/MM/AAAA — el formato que usan F3/F4/F6/F7/F10 (y datos.fecha de F5)
// para las fechas dentro del jsonb, ver formatoFecha() en exportOficial.js.
export function fechaDDMMAAAA(fecha) {
  const d = String(fecha.getDate()).padStart(2, '0');
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${fecha.getFullYear()}`;
}

// AAAA-MM-DD — el que produce nativamente <input type="date">, usado tal
// cual (sin pasar por formatoFecha) en F8 y en las columnas `fecha`/`items[].fecha`
// de encuentros_comunitarios / compromisos.
export function fechaISO(fecha) {
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${m}-${d}`;
}

export function fechaHaceDias(dias) {
  const f = new Date();
  f.setDate(f.getDate() - dias);
  return f;
}

export function MONEY(n) {
  return n ? Number(n).toLocaleString('es-CO', { minimumFractionDigits: 2 }) : '';
}

export function marcado(condicion) { return condicion ? 'X' : ''; }

export function marcadoUnicode(condicion) { return condicion ? '☒' : '□'; }

let contadorId = 0;
export function idLocal() {
  contadorId += 1;
  return `demo-${Date.now().toString(36)}-${contadorId}`;
}
