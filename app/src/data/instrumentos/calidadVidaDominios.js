// Calidad de vida por dominios — híbrido inspirado en la estructura de
// dominios del WHOQOL-BREF (OMS), esfera G. Bienestar.
//
// Por qué es híbrido: el WHOQOL-BREF exige permiso explícito de la OMS
// ("bajo ninguna circunstancia debe usarse sin permiso" según su propio
// manual). La estructura de 4 dominios de calidad de vida es de uso
// genérico en salud pública, no exclusiva de la OMS. Se redactan
// preguntas propias.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#g-bienestar.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Calidad de vida por dominios.

const SATISFACCION_4 = [
  { valor: 'mala', etiqueta: 'Mala', nivel: 'bajo' },
  { valor: 'regular', etiqueta: 'Regular', nivel: 'medio' },
  { valor: 'buena', etiqueta: 'Buena', nivel: 'alto' },
  { valor: 'muy_buena', etiqueta: 'Muy buena', nivel: 'alto' },
];

const SATISFACCION_3 = [
  { valor: 'poco', etiqueta: 'Poco satisfecho/a', nivel: 'bajo' },
  { valor: 'medio', etiqueta: 'Medianamente satisfecho/a', nivel: 'medio' },
  { valor: 'mucho', etiqueta: 'Muy satisfecho/a', nivel: 'alto' },
];

const PREGUNTAS = [
  { id: 'fisico', texto: '¿Cómo calificaría su salud física en general en las últimas semanas?', tipo: 'seleccion_unica', opciones: SATISFACCION_4 },
  { id: 'psicologico', texto: '¿Qué tan satisfecho/a se siente con su estado de ánimo y su capacidad de disfrutar la vida?', tipo: 'seleccion_unica', opciones: SATISFACCION_3 },
  { id: 'relaciones', texto: '¿Qué tan satisfecho/a está con sus relaciones personales?', tipo: 'seleccion_unica', opciones: SATISFACCION_3 },
  { id: 'ambiente', texto: '¿Qué tan satisfecho/a está con las condiciones de su entorno —vivienda, seguridad, acceso a servicios?', tipo: 'seleccion_unica', opciones: SATISFACCION_3 },
];

const NOMBRE_DOMINIO = {
  fisico: 'Físico',
  psicologico: 'Psicológico',
  relaciones: 'Relaciones sociales',
  ambiente: 'Ambiente',
};

function reglaSatisfaccionGeneralizada({ categorias }) {
  const claves = Object.keys(categorias);
  if (!claves.every((k) => categorias[k].nivel === 'alto')) return null;
  return {
    codigo: 'CVIDA_SATISFACCION_GENERALIZADA',
    nivel: 'fortaleza',
    titulo: 'Satisfacción generalizada con la calidad de vida',
    evidencia: claves.map((k) => `${NOMBRE_DOMINIO[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Los 4 dominios evaluados muestran satisfacción alta.',
    preguntas: ['¿Qué reconoce como parte de este bienestar general?'],
  };
}

function reglaInsatisfaccionGeneralizada({ categorias }) {
  const claves = Object.keys(categorias);
  if (!claves.every((k) => categorias[k].nivel === 'bajo')) return null;
  return {
    codigo: 'CVIDA_INSATISFACCION_GENERALIZADA',
    nivel: 'profundizacion',
    titulo: 'Insatisfacción generalizada con la calidad de vida',
    evidencia: claves.map((k) => `${NOMBRE_DOMINIO[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Los 4 dominios evaluados muestran baja satisfacción — señal relevante para priorizar el caso.',
    preguntas: ['¿Cuál de estos dominios siente que más necesita atención primero?'],
    riesgos: ['Baja satisfacción en los 4 dominios evaluados es un factor relevante para la priorización y el seguimiento del caso.'],
  };
}

function reglaMaterialSinRelacional({ categorias }) {
  const materialAlto = categorias.fisico.nivel === 'alto' || categorias.ambiente.nivel === 'alto';
  if (!materialAlto) return null;
  if (categorias.relaciones.nivel !== 'bajo') return null;
  return {
    codigo: 'CVIDA_MATERIAL_SIN_RELACIONAL',
    nivel: 'oportunidad',
    titulo: 'Bienestar material sin bienestar relacional',
    evidencia: [`Físico: ${categorias.fisico.etiqueta}`, `Ambiente: ${categorias.ambiente.etiqueta}`, `Relaciones sociales: ${categorias.relaciones.etiqueta}`],
    lectura: 'Las condiciones materiales o de entorno no se traducen necesariamente en satisfacción relacional.',
    preguntas: ['¿Qué le ayudaría a sentirse más acompañado/a o conectado/a con otras personas?'],
  };
}

// Exhaustivo: cubre el resto (ni todo alto, ni todo bajo).
function reglaMixta({ categorias }) {
  const claves = Object.keys(categorias);
  const RANGO = { bajo: 0, medio: 1, alto: 2 };
  const todasAltas = claves.every((k) => categorias[k].nivel === 'alto');
  const todasBajas = claves.every((k) => categorias[k].nivel === 'bajo');
  if (todasAltas || todasBajas) return null;

  const ordenadas = [...claves].sort((a, b) => RANGO[categorias[b].nivel] - RANGO[categorias[a].nivel]);
  const mas = ordenadas[0];
  const menos = ordenadas[ordenadas.length - 1];
  return {
    codigo: 'CVIDA_MIXTA',
    nivel: 'oportunidad',
    titulo: 'Calidad de vida con dominios desiguales',
    evidencia: claves.map((k) => `${NOMBRE_DOMINIO[k]}: ${categorias[k].etiqueta}`),
    lectura: `La satisfacción varía según el dominio: "${NOMBRE_DOMINIO[mas]}" es el más satisfecho, mientras "${NOMBRE_DOMINIO[menos]}" es el menos satisfecho.`,
    preguntas: [`¿Qué hace que "${NOMBRE_DOMINIO[mas]}" funcione bien?`, `¿Qué ayudaría a mejorar "${NOMBRE_DOMINIO[menos]}"?`],
  };
}

export const CALIDAD_VIDA_DOMINIOS = {
  id: 'CVIDAHIB',
  nombre: 'Calidad de Vida por Dominios',
  descripcion: 'Satisfacción percibida en los dominios físico, psicológico, relaciones sociales y entorno. Preguntas de diseño propio, inspiradas en la estructura del WHOQOL-BREF — no son sus ítems originales.',
  fuente: 'docs/matriz-variables-indicadores.md#g-bienestar',
  preguntas: PREGUNTAS,
  reglas: [reglaSatisfaccionGeneralizada, reglaInsatisfaccionGeneralizada, reglaMaterialSinRelacional, reglaMixta],
};
