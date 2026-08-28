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

// Para F1 (Mapa de Pertenencia): el .docx oficial no trae marcadores de
// texto — son dos diagramas en blanco para dibujar a mano (ver
// docs/exportacion-formatos-oficiales.md). En vez de una plantilla con
// {tags}, se descarga el .docx oficial tal cual y se reemplazan sus dos
// imágenes internas (word/media/image1.jpeg = "Mapa Actual",
// word/media/image2.jpeg = "Mapa Potencial") por las que ya genera la app
// con el diagrama real del caso + el análisis de lectura de red debajo
// (ver svgAImagen.js) — no hace falta Docxtemplater, es más simple
// manipular el zip directamente con PizZip.
export async function descargarDocxConImagenes(plantillaUrl, reemplazosMedia, nombreArchivo) {
  const respuesta = await fetch(plantillaUrl);
  if (!respuesta.ok) throw new Error(`No se encontró la plantilla oficial (${plantillaUrl}).`);
  const arrayBuffer = await respuesta.arrayBuffer();

  const zip = new PizZip(arrayBuffer);
  for (const [ruta, imagenBlob] of Object.entries(reemplazosMedia)) {
    zip.file(ruta, await imagenBlob.arrayBuffer());
  }

  const blob = zip.generate({ type: 'blob', mimeType: DOCX_MIME });
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

// Convierte un valor posiblemente vacío/indefinido en el texto que se
// imprime sobre las líneas en blanco del documento oficial.
export function t(valor) {
  return valor === undefined || valor === null || valor === '' ? '' : String(valor);
}
