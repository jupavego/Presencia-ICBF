// Exportación maestra consolidada: un .xlsx nuevo (no una plantilla
// oficial, distinto de exportOficial.js) con una fila por caso y una
// columna de calificación (1-5) por cada herramienta del Módulo de
// Perfilamiento — para análisis agregado por regional. No reemplaza ni
// toca las plantillas oficiales F1-F10 ya existentes.

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { supabase } from './supabaseClient.js';
import { AMBITOS } from '../data/ambitos.js';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Misma deduplicación por componentKey que ya usa PerfilSesionPanel.jsx
// para construir su mapa de herramientas — F1 queda fuera porque usa un
// motor de lectura distinto (lecturaRed.js), sin `calificacion`.
function listaHerramientas() {
  const vistas = new Set();
  const lista = [];
  for (const ambito of AMBITOS) {
    for (const h of ambito.herramientas) {
      if (!h.componentKey || h.componentKey === 'F1' || vistas.has(h.componentKey)) continue;
      vistas.add(h.componentKey);
      lista.push({ id: h.componentKey, nombre: h.nombre });
    }
  }
  return lista;
}

// Consulta todos los casos visibles para el usuario autenticado (RLS ya
// filtra) y sus resultados de perfilamiento, arma una tabla en memoria y
// descarga un workbook generado desde cero con ExcelJS.
export async function exportarResumenMaestro() {
  const herramientas = listaHerramientas();

  const [{ data: casos, error: errorCasos }, { data: resultados, error: errorResultados }] = await Promise.all([
    supabase.from('casos').select('id, numero_peticion, nombre_participante, municipio, creado_en').order('creado_en', { ascending: false }),
    supabase.from('perfilamiento_resultados').select('caso_id, instrumento_id, resultado'),
  ]);
  if (errorCasos) throw errorCasos;
  if (errorResultados) throw errorResultados;

  const calificacionesPorCaso = {};
  for (const fila of resultados || []) {
    if (!calificacionesPorCaso[fila.caso_id]) calificacionesPorCaso[fila.caso_id] = {};
    calificacionesPorCaso[fila.caso_id][fila.instrumento_id] = fila.resultado?.calificacion ?? null;
  }

  const workbook = new ExcelJS.Workbook();
  const hoja = workbook.addWorksheet('Resumen maestro');
  hoja.columns = [
    { header: 'N° Petición', key: 'numero_peticion', width: 18 },
    { header: 'Participante', key: 'nombre_participante', width: 28 },
    { header: 'Municipio', key: 'municipio', width: 20 },
    { header: 'Fecha creación', key: 'creado_en', width: 14 },
    ...herramientas.map((h) => ({ header: h.nombre, key: h.id, width: 16 })),
  ];
  hoja.getRow(1).font = { bold: true };

  for (const caso of casos || []) {
    const calificaciones = calificacionesPorCaso[caso.id] || {};
    const fila = {
      numero_peticion: caso.numero_peticion || '',
      nombre_participante: caso.nombre_participante || '',
      municipio: caso.municipio || '',
      creado_en: caso.creado_en ? new Date(caso.creado_en).toLocaleDateString('es-CO') : '',
    };
    for (const h of herramientas) fila[h.id] = calificaciones[h.id] ?? '';
    hoja.addRow(fila);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: XLSX_MIME });
  saveAs(blob, `resumen-maestro-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
