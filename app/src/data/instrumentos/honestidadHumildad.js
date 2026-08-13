// Honestidad-Humildad — híbrido inspirado en la dimensión de Ashton & Lee
// (modelo HEXACO), esfera A. Persona.
//
// Por qué es híbrido: HEXACO-PI-R-60 completo queda bloqueado por licencia
// de investigación académica. Las otras 5 dimensiones del modelo ya las
// cubre el BFI-2 (licencia abierta); Honestidad-Humildad es la única
// aportación real de HEXACO que no se duplica. Se conserva el constructo
// (Ashton & Lee, dominio académico) y se redactan preguntas propias.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#a-persona.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Honestidad-Humildad.

const FRECUENCIA = [
  { valor: 'nunca', etiqueta: 'Nunca', nivel: 'bajo' },
  { valor: 'a_veces', etiqueta: 'A veces', nivel: 'bajo' },
  { valor: 'frecuentemente', etiqueta: 'Frecuentemente', nivel: 'alto' },
  { valor: 'siempre', etiqueta: 'Siempre', nivel: 'alto' },
];

const PREGUNTAS = [
  {
    id: 'sinceridad',
    texto: '¿Qué tan importante es para usted ser sincero/a incluso cuando eso lo pone en desventaja?',
    tipo: 'frecuencia',
    opciones: FRECUENCIA,
  },
  {
    id: 'evitar_aprovechar',
    texto: '¿Suele evitar aprovecharse de otras personas aunque tenga la oportunidad?',
    tipo: 'frecuencia',
    opciones: FRECUENCIA,
  },
  {
    id: 'incomodidad_elogios',
    texto: '¿Le incomoda recibir elogios o reconocimientos exagerados?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No', nivel: 'bajo' },
      { valor: 'parcial', etiqueta: 'Parcialmente', nivel: 'medio' },
      { valor: 'si', etiqueta: 'Sí', nivel: 'alto' },
    ],
  },
];

const NOMBRE_PREGUNTA = {
  sinceridad: 'Sinceridad aunque ponga en desventaja',
  evitar_aprovechar: 'Evitar aprovecharse de otros',
  incomodidad_elogios: 'Incomodidad ante elogios exagerados',
};

function reglaConsistente({ categorias }) {
  const claves = Object.keys(categorias);
  if (!claves.every((k) => categorias[k].nivel === 'alto')) return null;
  return {
    codigo: 'HONHUM_CONSISTENTE',
    nivel: 'fortaleza',
    titulo: 'Rasgo consistente',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'El rasgo se manifiesta de forma consistente en las situaciones exploradas.',
    preguntas: ['¿En qué situaciones recientes ha visto reflejado esto?'],
  };
}

function reglaEquidadSinAsertividad({ categorias }) {
  if (categorias.evitar_aprovechar.nivel !== 'alto') return null;
  if (categorias.sinceridad.nivel !== 'bajo') return null;
  return {
    codigo: 'HONHUM_EQUIDAD_SIN_ASERTIVIDAD',
    nivel: 'oportunidad',
    titulo: 'Equidad sin asertividad',
    evidencia: [`Evitar aprovecharse de otros: ${categorias.evitar_aprovechar.etiqueta}`, `Sinceridad aunque ponga en desventaja: ${categorias.sinceridad.etiqueta}`],
    lectura: 'Se cuida de no perjudicar a otros, pero le cuesta ser sincero/a cuando eso lo/la pone en desventaja a sí mismo/a — matiz para la conversación, no una contradicción a resolver.',
    preguntas: ['¿Qué hace más difícil decir lo que piensa cuando eso lo/la perjudica?'],
  };
}

// Exhaustivo: cubre el resto de combinaciones.
function reglaMixta({ categorias }) {
  const claves = Object.keys(categorias);
  const altas = claves.filter((k) => categorias[k].nivel === 'alto');
  if (altas.length === 3 || altas.length === 0) return null;
  return {
    codigo: 'HONHUM_MIXTA',
    nivel: 'oportunidad',
    titulo: 'Honestidad-Humildad con señales mixtas',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Las respuestas combinan señales presentes y ausentes del rasgo — vale la pena explorarlo en la conversación, no promediarlo.',
    preguntas: ['¿Cuál de estas situaciones describe mejor a la persona: la sinceridad, evitar aprovecharse de otros, o la modestia?'],
  };
}

function reglaAusente({ categorias }) {
  const claves = Object.keys(categorias);
  if (!claves.every((k) => categorias[k].nivel === 'bajo')) return null;
  return {
    codigo: 'HONHUM_AUSENTE',
    nivel: 'profundizacion',
    titulo: 'Rasgo poco presente en lo explorado',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Las situaciones exploradas no muestran evidencia fuerte de este rasgo — no implica un juicio, es información para profundizar en la conversación.',
    preguntas: ['¿Hay situaciones donde esto se manifieste de otra forma no capturada aquí?'],
  };
}

export const HONESTIDAD_HUMILDAD = {
  id: 'HONHUM',
  nombre: 'Honestidad-Humildad',
  descripcion: 'Sinceridad, equidad, evitación de la avaricia, modestia. Preguntas de diseño propio, inspiradas en la dimensión de Ashton & Lee (HEXACO) — no son los ítems originales.',
  fuente: 'docs/matriz-variables-indicadores.md#a-persona',
  preguntas: PREGUNTAS,
  reglas: [reglaConsistente, reglaEquidadSinAsertividad, reglaAusente, reglaMixta],
};
