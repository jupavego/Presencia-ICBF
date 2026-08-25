// Reproduce, en Node, exactamente lo que src/lib/exportOficial.js hace en el
// navegador (rellenar la plantilla oficial .docx/.xlsx con los mismos
// `datos` que arma cada formato) — sin usar `fetch`/`file-saver` (no
// aplican fuera del navegador): se lee la plantilla del disco con `fs` y el
// archivo resultante se escribe también a disco, en vez de descargarse.
//
// Además de generar el documento, `renderDocx` reporta qué marcadores
// {tag} de la plantilla oficial se quedaron sin dato — la verificación de
// que "todo lo que se diligencia en el formulario llega al formato
// institucional" que pidió el usuario.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ExcelJS from 'exceljs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const PLANTILLAS_DIR = path.resolve(AQUI, '../../public/plantillas');
export const SALIDA_DIR = path.resolve(AQUI, '../../scripts-output/seed-demo');
const ROOT_FOLDER_NAME = 'Presencia ICBF - Expedientes 2026'; // mismo nombre que usa drive-storage/index.ts

// Convierte AAAA-MM-DD -> DD/MM/AAAA (igual que formatoFecha() en
// exportOficial.js) sin importar ese archivo (arrastra file-saver, que no
// corre en Node).
export function formatoFecha(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function nombreSeguro(texto) {
  return String(texto).replace(/[\\/:*?"<>|]/g, '-').trim();
}

export function rutaSalida(profesionalNombre, beneficiarioNombre, fase, fileName) {
  return path.join(SALIDA_DIR, ROOT_FOLDER_NAME, nombreSeguro(profesionalNombre), nombreSeguro(beneficiarioNombre), nombreSeguro(fase), fileName);
}

export function guardarArchivo(rutaDestino, buffer) {
  mkdirSync(path.dirname(rutaDestino), { recursive: true });
  writeFileSync(rutaDestino, buffer);
}

// Rellena una plantilla .docx con `datos` (mismo objeto que guarda
// formatos_oficiales_datos.datos) y devuelve el buffer + los marcadores de
// la plantilla que no encontraron dato (nullGetter de docxtemplater).
export function renderDocx(nombrePlantilla, datos) {
  const rutaPlantilla = path.join(PLANTILLAS_DIR, nombrePlantilla);
  const arrayBuffer = readFileSync(rutaPlantilla);
  const zip = new PizZip(arrayBuffer);
  const camposFaltantes = new Set();
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter(part) {
      if (part?.value) camposFaltantes.add(part.value);
      return '';
    },
  });
  doc.render(datos);
  const buffer = doc.getZip().generate({ type: 'nodebuffer' });
  return { buffer, camposFaltantes: [...camposFaltantes] };
}

async function cargarWorkbook(nombrePlantilla) {
  const rutaPlantilla = path.join(PLANTILLAS_DIR, nombrePlantilla);
  const arrayBuffer = readFileSync(rutaPlantilla);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);
  return workbook;
}

// --- F4 · réplica exacta de la escritura de celdas de F4EncuestaSatisfaccion.jsx ---
const COLUMNA_ESCALA_F4 = { '1 · Totalmente insatisfecho': 'C', '2 · Insatisfecho': 'D', '3 · Indiferente': 'E', '4 · Satisfecho': 'F', '5 · Totalmente satisfecho': 'G', 'N/A': 'H' };
const FILA_ITEM_F4 = { 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26 };

function marcarBlanco(texto, respuesta) {
  if (!respuesta) return texto;
  const patron = respuesta === 'Sí' ? /si\s*_/i : /no\s*_/i;
  return texto.replace(patron, (m) => m.slice(0, -1) + 'X');
}

function marcarEnRichText(valorCelda, fragmentoBusqueda, respuesta) {
  if (!valorCelda?.richText) return valorCelda;
  const idx = valorCelda.richText.findIndex((run) => run.text.includes(fragmentoBusqueda));
  if (idx === -1) return valorCelda;
  return { ...valorCelda, richText: valorCelda.richText.map((run, i) => (i === idx ? { ...run, text: marcarBlanco(run.text, respuesta) } : run)) };
}

export async function renderF4Xlsx(datos) {
  const workbook = await cargarWorkbook('F4-Encuesta-Satisfaccion.xlsx');
  const ws = workbook.worksheets[0];
  ws.getCell('C6').value = datos.departamento || '';
  ws.getCell('C7').value = datos.municipio || '';
  ws.getCell('C9').value = datos.fecha || '';
  ws.getCell('C10').value = datos.profesionales || '';
  ws.getCell('C11').value = datos.nombreResponde || '';
  ws.getCell('C12').value = datos.documentoResponde || '';

  let a14 = ws.getCell('A14').value;
  a14 = marcarEnRichText(a14, 'Entiendo la información', datos.entiendeInfo);
  a14 = marcarEnRichText(a14, '¿Estaría de acuerdo', datos.aceptaResponder);
  ws.getCell('A14').value = a14;

  ws.getCell('A27').value = marcarBlanco(String(ws.getCell('A27').value || ''), datos.respuestaSolicitud);
  ws.getCell('A28').value = marcarBlanco(String(ws.getCell('A28').value || ''), datos.fortalecioCapacidades);

  const camposFaltantes = [];
  for (let i = 1; i <= 7; i += 1) {
    const col = COLUMNA_ESCALA_F4[datos.respuestas?.[String(i)]];
    if (col) ws.getCell(`${col}${FILA_ITEM_F4[i]}`).value = 'X';
    else camposFaltantes.push(`respuestas.${i}`);
  }
  ws.getCell('A30').value = datos.sugerencias || '';

  const buffer = await workbook.xlsx.writeBuffer();
  return { buffer, camposFaltantes };
}

// --- F8 · réplica exacta de la escritura de celdas de F8Cronograma.jsx ---
const FILA_INICIAL_F8 = 14;
const COLS_FAMILIAR_F8 = { num: 'D', fecha: 'E', inicio: 'F', fin: 'G', nombre: 'H', cedula: 'I', telefono: 'J', direccion: 'K', municipio: 'L', comuna: 'M', barrio: 'N', vereda: 'O', referencia: 'P', observaciones: 'Q' };
const COLS_COMUNITARIO_F8 = { num: 'D', fecha: 'E', inicio: 'F', fin: 'G', familias: 'H', lugar: 'I', municipio: 'J', comuna: 'K', barrio: 'L', vereda: 'M', referencia: 'N', observaciones: 'O' };

function escribirFilasF8(ws, filas, columnas) {
  filas.forEach((fila, i) => {
    const r = FILA_INICIAL_F8 + i;
    Object.entries(columnas).forEach(([campo, col]) => {
      const valor = campo === 'fecha' ? formatoFecha(fila[campo]) : (fila[campo] || '');
      ws.getCell(`${col}${r}`).value = valor;
    });
  });
}

export async function renderF8Xlsx(datos) {
  const workbook = await cargarWorkbook('F8-Cronograma.xlsx');
  const wsFamiliar = workbook.getWorksheet('Acomp Entorno Familiar');
  wsFamiliar.getCell('C10').value = datos.regional || '';
  wsFamiliar.getCell('H10').value = datos.centroZonal || '';
  wsFamiliar.getCell(`B${FILA_INICIAL_F8}`).value = datos.profesional || '';
  wsFamiliar.getCell(`C${FILA_INICIAL_F8}`).value = datos.telefono || '';
  escribirFilasF8(wsFamiliar, datos.familiar, COLS_FAMILIAR_F8);

  const wsComunitario = workbook.worksheets[2];
  wsComunitario.getCell('D10').value = datos.regional || '';
  wsComunitario.getCell(`B${FILA_INICIAL_F8}`).value = datos.profesional || '';
  wsComunitario.getCell(`C${FILA_INICIAL_F8}`).value = datos.telefono || '';
  escribirFilasF8(wsComunitario, datos.comunitario, COLS_COMUNITARIO_F8);

  const buffer = await workbook.xlsx.writeBuffer();
  return { buffer, camposFaltantes: [] };
}
