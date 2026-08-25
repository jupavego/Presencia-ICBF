// Carga app/.env a process.env sin depender de un paquete externo (no hay
// `dotenv` entre las dependencias del proyecto y no vale la pena agregarlo
// solo para esto). Soporta líneas `CLAVE=valor`, comentarios `#` y líneas
// vacías; no sobrescribe variables ya presentes en el entorno real.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.resolve(AQUI, '../../.env');

export function cargarEnv() {
  let texto;
  try {
    texto = readFileSync(ENV_PATH, 'utf8');
  } catch {
    return;
  }
  for (const linea of texto.split('\n')) {
    const limpia = linea.trim();
    if (!limpia || limpia.startsWith('#')) continue;
    const idx = limpia.indexOf('=');
    if (idx === -1) continue;
    const clave = limpia.slice(0, idx).trim();
    const valor = limpia.slice(idx + 1).trim();
    if (process.env[clave] === undefined) process.env[clave] = valor;
  }
}
