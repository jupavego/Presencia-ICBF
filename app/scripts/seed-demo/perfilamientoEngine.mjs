// Genera `resultado` válido para las 25 herramientas del Módulo de
// Perfilamiento SIN reinventar sus reglas de puntuación: importa
// directamente el motor real (src/lib/motorInstrumento.js) y las 25
// definiciones (src/data/instrumentos/*.js) — son JS puro, sin React ni
// DOM, así que corren igual bajo Node (ver investigación previa, spec
// perfilamiento). Este archivo solo arma un objeto `respuestas` sintético
// con sesgo controlado (t = intensidad objetivo 0..1) y se lo pasa al
// motor real; el motor calcula puntajes/categorías y evalúa las ~90 reglas
// de interacción reales, así que los `patrones` resultantes son siempre
// coherentes con las respuestas, igual que en la app.
import { leerInstrumento, leerInstrumentoMultiescala, leerCategorias } from '../../src/lib/motorInstrumento.js';

import { WHO5 } from '../../src/data/instrumentos/who5.js';
import { AUTOEFICACIA } from '../../src/data/instrumentos/autoeficacia.js';
import { BFI2 } from '../../src/data/instrumentos/bfi2.js';
import { MCMASTER_FAD } from '../../src/data/instrumentos/mcmasterFad.js';
import { FACES20ESP } from '../../src/data/instrumentos/faces20esp.js';
import { FRAS_HIBRIDO } from '../../src/data/instrumentos/frasHibrido.js';
import { FRAS_REAL } from '../../src/data/instrumentos/frasReal.js';
import { FQOL } from '../../src/data/instrumentos/fqol.js';
import { MSPSS } from '../../src/data/instrumentos/mspss.js';
import { AUTOESTIMA } from '../../src/data/instrumentos/autoestima.js';
import { HONESTIDAD_HUMILDAD } from '../../src/data/instrumentos/honestidadHumildad.js';
import { RESILIENCIA_INDIVIDUAL } from '../../src/data/instrumentos/resilienciaIndividual.js';
import { FORTALEZAS_POR_VIRTUD } from '../../src/data/instrumentos/fortalezasPorVirtud.js';
import { INTERESES_TIPOLOGICOS } from '../../src/data/instrumentos/interesesTipologicos.js';
import { INTERESES_PREFERENCIAS_VITALES } from '../../src/data/instrumentos/interesesPreferenciasVitales.js';
import { APTITUDES_HABILIDADES } from '../../src/data/instrumentos/aptitudesHabilidades.js';
import { EMPODERAMIENTO_FAMILIAR } from '../../src/data/instrumentos/empoderamientoFamiliar.js';
import { PRACTICAS_CRIANZA } from '../../src/data/instrumentos/practicasCrianza.js';
import { CALIDAD_VIDA_DOMINIOS } from '../../src/data/instrumentos/calidadVidaDominios.js';
import { EXPLORACION_EDUCATIVA } from '../../src/data/instrumentos/exploracionEducativa.js';
import { EXPLORACION_OCUPACIONAL } from '../../src/data/instrumentos/exploracionOcupacional.js';
import { CARACTERIZACION_SOCIOECONOMICA } from '../../src/data/instrumentos/caracterizacionSocioeconomica.js';
import { EXPLORACION_CULTURAL } from '../../src/data/instrumentos/exploracionCultural.js';
import { EXPLORACION_TERRITORIAL } from '../../src/data/instrumentos/exploracionTerritorial.js';
import { PROYECTO_DE_VIDA } from '../../src/data/instrumentos/proyectoDeVida.js';

// motor: 'A' unidimensional (leerInstrumento), 'AM' multiescala
// (leerInstrumentoMultiescala), 'B' cualitativo (leerCategorias) — ver §1
// del spec de investigación.
export const INSTRUMENTOS = [
  { def: WHO5, motor: 'A' },
  { def: AUTOEFICACIA, motor: 'A' },
  { def: BFI2, motor: 'AM' },
  { def: MCMASTER_FAD, motor: 'AM' },
  { def: FACES20ESP, motor: 'AM' },
  { def: FRAS_HIBRIDO, motor: 'AM' },
  { def: FRAS_REAL, motor: 'AM' },
  { def: FQOL, motor: 'AM' },
  { def: MSPSS, motor: 'AM' },
  { def: AUTOESTIMA, motor: 'B' },
  { def: HONESTIDAD_HUMILDAD, motor: 'B' },
  { def: RESILIENCIA_INDIVIDUAL, motor: 'B' },
  { def: FORTALEZAS_POR_VIRTUD, motor: 'B' },
  { def: INTERESES_TIPOLOGICOS, motor: 'B' },
  { def: INTERESES_PREFERENCIAS_VITALES, motor: 'B' },
  { def: APTITUDES_HABILIDADES, motor: 'B' },
  { def: EMPODERAMIENTO_FAMILIAR, motor: 'B' },
  { def: PRACTICAS_CRIANZA, motor: 'B' },
  { def: CALIDAD_VIDA_DOMINIOS, motor: 'B' },
  { def: EXPLORACION_EDUCATIVA, motor: 'B' },
  { def: EXPLORACION_OCUPACIONAL, motor: 'B' },
  { def: CARACTERIZACION_SOCIOECONOMICA, motor: 'B' },
  { def: EXPLORACION_CULTURAL, motor: 'B' },
  { def: EXPLORACION_TERRITORIAL, motor: 'B' },
  { def: PROYECTO_DE_VIDA, motor: 'B' },
];

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// Ruido gaussiano (Box-Muller) — más natural que uniforme para que las
// respuestas "tiemblen" alrededor del objetivo en vez de saltar parejo.
function gauss(sigma) {
  if (sigma <= 0) return 0;
  let u = 0; let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * sigma;
}

// --- Tipo A / AM: ítems Likert con dominio en `opciones` (o escalaMin/Max) ---
function valorItemLikert(item, opciones, t, invertidaInstrumento, noise) {
  const valores = [...new Set(opciones.map((o) => o.valor))].sort((a, b) => a - b);
  const direccion = (item.invertido ? -1 : 1) * (invertidaInstrumento ? -1 : 1);
  const objetivo = clamp((direccion === 1 ? t : 1 - t) + gauss(noise), 0, 1);
  const idx = Math.round(objetivo * (valores.length - 1));
  return valores[idx];
}

function respuestasLikert(items, opciones, t, invertidaInstrumento, noise, atipicoRatio) {
  const r = {};
  for (const item of items) {
    const esAtipico = atipicoRatio > 0 && Math.random() < atipicoRatio;
    const tItem = esAtipico ? 1 - t : t;
    r[item.id] = valorItemLikert(item, opciones, tItem, invertidaInstrumento, noise);
  }
  return r;
}

// --- Tipo B: preguntas categóricas (nivel bajo/medio/alto o positiva bool) ---
function rangoOpcion(o) {
  if (o.nivel) return { bajo: 0, medio: 0.5, alto: 1 }[o.nivel] ?? 0.5;
  if (typeof o.positiva === 'boolean') return o.positiva ? 1 : 0;
  return null;
}

function elegirOpcionUnica(opciones, t, noise) {
  const objetivo = clamp(t + gauss(noise), 0, 1);
  const conRango = opciones.some((o) => rangoOpcion(o) !== null);
  if (!conRango) {
    const idx = clamp(Math.round(objetivo * (opciones.length - 1)), 0, opciones.length - 1);
    return opciones[idx].valor;
  }
  let mejor = opciones[0];
  let mejorDist = Infinity;
  for (const o of opciones) {
    const r = rangoOpcion(o) ?? 0.5;
    const d = Math.abs(r - objetivo);
    if (d < mejorDist) { mejorDist = d; mejor = o; }
  }
  return mejor.valor;
}

const SENTINELS_VACIO = new Set(['ninguno', 'ninguna', 'no_aplica', 'sin_fijo']);

function elegirChecklist(opciones, t, noise, opcional) {
  const objetivo = clamp(t + gauss(noise), 0, 1);
  const sentinel = opciones.find((o) => SENTINELS_VACIO.has(o.valor));
  if (sentinel && objetivo < 0.18 && Math.random() < 0.7) return [sentinel.valor];

  const disponibles = opciones.filter((o) => o !== sentinel);
  const conRango = disponibles.some((o) => rangoOpcion(o) !== null);
  let orden = [...disponibles];
  if (conRango) {
    orden.sort((a, b) => (rangoOpcion(b) ?? 0.5) - (rangoOpcion(a) ?? 0.5));
    if (objetivo < 0.5) orden.reverse();
  } else {
    orden = orden.sort(() => Math.random() - 0.5);
  }
  const n = clamp(Math.round(objetivo * disponibles.length + gauss(1)), opcional ? 0 : 1, disponibles.length);
  const elegidos = orden.slice(0, n).map((o) => o.valor);
  if (elegidos.length > 0) return elegidos;
  return opcional ? [] : [disponibles[0].valor];
}

function elegirNumerico(pregunta, t) {
  // Solo se usa hoy para 'dependientes' (caracterizacionSocioeconomica.js) —
  // a menor t (más vulnerable), más personas dependientes del mismo ingreso.
  const base = /depend/i.test(pregunta.id) ? 5 : 3;
  return Math.max(0, Math.round((1 - t) * base + gauss(1)));
}

const NOTAS_POR_NIVEL = {
  bajo: ['Cuesta encontrar las palabras para esto, pero se intenta seguir adelante.', 'Es un tema que preferiría no profundizar por ahora.', 'Ha sido difícil, sobre todo en los últimos meses.'],
  medio: ['Depende del día, hay momentos mejores que otros.', 'Va cambiando según lo que pase en la semana.', 'Es algo en lo que todavía está trabajando.'],
  alto: ['Es algo de lo que se siente orgulloso/a de contar.', 'Ha sido un apoyo constante en el último tiempo.', 'Se siente cómodo/a hablando de esto.'],
};

function fraseNota(t) {
  const bucket = t >= 0.66 ? 'alto' : t <= 0.33 ? 'bajo' : 'medio';
  const opciones = NOTAS_POR_NIVEL[bucket];
  return opciones[Math.floor(Math.random() * opciones.length)];
}

function respuestasCategoricas(preguntas, t, noise, atipicoRatio) {
  const r = {};
  for (const p of preguntas) {
    const esAtipico = atipicoRatio > 0 && Math.random() < atipicoRatio;
    const tPregunta = esAtipico ? 1 - t : t;
    if (p.tipo === 'checklist') {
      r[p.id] = elegirChecklist(p.opciones, tPregunta, noise, p.opcional);
    } else if (p.tipo === 'numerico') {
      r[p.id] = elegirNumerico(p, tPregunta);
    } else {
      r[p.id] = elegirOpcionUnica(p.opciones, tPregunta, noise);
    }
    if (p.notaAbierta && Math.random() < 0.4) {
      r[`${p.id}_nota`] = fraseNota(tPregunta);
    }
  }
  return r;
}

// t efectivo para este instrumento dentro de este perfil: en modo 'atipico'
// cada instrumento sortea su propio nivel (incoherencia ENTRE instrumentos,
// no solo dentro de uno) en vez de compartir el `t` base del perfil.
function tParaInstrumento(perfil) {
  if (perfil.modo !== 'atipico') return perfil.t;
  return clamp(0.5 + gauss(0.38), 0.05, 0.95);
}

export function generarResultadoInstrumento(entry, perfil) {
  const { def, motor } = entry;
  const t = tParaInstrumento(perfil);
  const { noise, atipicoRatio } = perfil;

  if (motor === 'A') {
    const respuestas = respuestasLikert(def.items, def.opciones, t, def.orientacion === 'invertida', noise, atipicoRatio);
    return { instrumentoId: def.id, resultado: leerInstrumento(def, respuestas) };
  }

  if (motor === 'AM') {
    const items = def.subescalas.flatMap((s) => s.items);
    const invertida = def.orientacion === 'invertida';
    const respuestas = respuestasLikert(items, def.opciones, t, invertida, noise, atipicoRatio);
    // FQOL: la UI filtra la subescala condicional 'discapacidad' ANTES de
    // llamar al motor (ver spec) — se replica igual acá, por caso.
    let motorDef = def;
    if (def.id === 'FQOL' && !perfil.fqolAplicaDiscapacidad) {
      motorDef = { ...def, subescalas: def.subescalas.filter((s) => s.id !== 'discapacidad') };
    }
    return { instrumentoId: def.id, resultado: leerInstrumentoMultiescala(motorDef, respuestas) };
  }

  // motor === 'B'
  const respuestas = respuestasCategoricas(def.preguntas, t, noise, atipicoRatio);
  return { instrumentoId: def.id, resultado: leerCategorias(def, respuestas) };
}

// Genera y valida los 25 resultados de un perfil-beneficiario. Descarta (con
// aviso) cualquier resultado con completo!==true — no debería pasar nunca
// si las definiciones están bien formadas, pero es la misma garantía que
// aplica la app antes de persistir (useRegistrarEnPerfilSesion).
export function generarPerfilamientoCompleto(perfil) {
  const filas = [];
  for (const entry of INSTRUMENTOS) {
    const { instrumentoId, resultado } = generarResultadoInstrumento(entry, perfil);
    if (resultado?.completo !== true) {
      console.warn(`  ! ${instrumentoId}: resultado incompleto para ${perfil.key}, se omite (revisar generador)`);
      continue;
    }
    filas.push({ instrumento_id: instrumentoId, resultado });
  }
  return filas;
}
