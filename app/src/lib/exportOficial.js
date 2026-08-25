// Exportación a los formatos oficiales del ICBF (.docx / .xlsx).
//
// No se modifica el diseño de los documentos originales (los que están en
// formatos/ en la raíz del proyecto): las plantillas que se cargan aquí son
// una copia de esos mismos archivos con marcadores de fusión invisibles
// insertados en los espacios en blanco (líneas "____", casillas, celdas),
// generadas con python-docx/openpyxl a partir del original. Ver
// app/docs/exportacion-formatos-oficiales.md para el detalle de cómo se
// construyó cada plantilla y qué campos cubre.
//
// La generación del documento corre en el navegador (el archivo se arma
// localmente y se descarga); el guardado de esos mismos datos en el
// servidor, para que sobrevivan a recargar la página, vive aparte en
// persistenciaCaso.js — cada formato llama a ambas cosas al enviar.

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Rellena una plantilla .docx (con marcadores {tag}) con los datos
// capturados en el formulario y descarga el resultado.
export async function descargarDocxOficial(plantillaUrl, datos, nombreArchivo) {
  const respuesta = await fetch(plantillaUrl);
  if (!respuesta.ok) throw new Error(`No se encontró la plantilla oficial (${plantillaUrl}).`);
  const arrayBuffer = await respuesta.arrayBuffer();

  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render(datos);

  const blob = doc.getZip().generate({ type: 'blob', mimeType: DOCX_MIME });
  saveAs(blob, nombreArchivo);
  return blob;
}

// Carga una plantilla .xlsx original, permite escribir directamente sobre
// sus celdas (conservando el formato y el diseño del libro), y descarga el
// resultado. `mutar` recibe el workbook de exceljs ya cargado.
export async function descargarXlsxOficial(plantillaUrl, mutar, nombreArchivo) {
  const respuesta = await fetch(plantillaUrl);
  if (!respuesta.ok) throw new Error(`No se encontró la plantilla oficial (${plantillaUrl}).`);
  const arrayBuffer = await respuesta.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);
  mutar(workbook);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: XLSX_MIME });
  saveAs(blob, nombreArchivo);
  return blob;
}

// Formatea una fecha ISO (yyyy-mm-dd, tal como la entregan los <input type="date">)
// a dd/mm/aaaa, el formato que usan todos los formatos oficiales del servicio.
export function formatoFecha(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

// Convierte un valor posiblemente vacío/indefinido en el texto que se
// imprime sobre las líneas en blanco del documento oficial.
export function t(valor) {
  return valor === undefined || valor === null || valor === '' ? '' : String(valor);
}
