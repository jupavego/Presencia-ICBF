// Resiliencia individual — híbrido inspirado en el constructo del CD-RISC
// (Connor-Davidson Resilience Scale), esfera A. Persona. Distinta de la
// resiliencia familiar (esfera C, ver frasHibrido.js).
//
// Por qué es híbrido: CD-RISC es un instrumento comercial, requiere
// licencia paga. Se conserva el constructo (capacidad de adaptación
// personal ante la adversidad) y se redactan preguntas propias — no se
// usó ningún ítem del instrumento original.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#a-persona.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Resiliencia individual.

const PREGUNTAS = [
  {
    id: 'recursos_propios',
    texto: 'Cuando enfrenta una dificultad grande, ¿qué tanto siente que puede salir adelante con sus propios recursos?',
    tipo: 'frecuencia',
    opciones: [
      { valor: 'nunca', etiqueta: 'Nunca', nivel: 'bajo' },
      { valor: 'a_veces', etiqueta: 'A veces', nivel: 'bajo' },
      { valor: 'frecuentemente', etiqueta: 'Frecuentemente', nivel: 'alto' },
      { valor: 'siempre', etiqueta: 'Siempre', nivel: 'alto' },
    ],
  },
  {
    id: 'experiencia_previa',
    texto: '¿Ha logrado recuperarse de situaciones difíciles en el pasado?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No', nivel: 'bajo' },
      { valor: 'parcial', etiqueta: 'Parcialmente', nivel: 'medio' },
      { valor: 'si', etiqueta: 'Sí', nivel: 'alto' },
    ],
    notaAbierta: true,
    notaPlaceholder: '¿De qué situación, y qué le ayudó?',
  },
  {
    id: 'adaptabilidad',
    texto: '¿Se considera una persona que se adapta con relativa facilidad a los cambios?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No', nivel: 'bajo' },
      { valor: 'parcial', etiqueta: 'Parcialmente', nivel: 'medio' },
      { valor: 'si', etiqueta: 'Sí', nivel: 'alto' },
    ],
    notaAbierta: true,
    notaPlaceholder: '¿Puede dar un ejemplo reciente?',
  },
];

const NOMBRE_PREGUNTA = {
  recursos_propios: 'Recursos propios percibidos ante dificultades',
  experiencia_previa: 'Experiencia de recuperación previa',
  adaptabilidad: 'Adaptabilidad ante los cambios',
};

function reglaConsolidadaConHistoria({ categorias }) {
  const claves = Object.keys(categorias);
  if (!claves.every((k) => categorias[k].nivel === 'alto')) return null;
  return {
    codigo: 'RESIND_CONSOLIDADA',
    nivel: 'fortaleza',
    titulo: 'Resiliencia consolidada con historia',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'La percepción de capacidad de recuperación está respaldada por experiencia previa concreta.',
    preguntas: ['¿Qué le ha ayudado a salir adelante en esas situaciones anteriores?'],
    estrategias: ['Reconocer explícitamente este recurso como una fortaleza a la que la persona puede volver a recurrir.'],
  };
}

function reglaConfianzaSinHistoria({ categorias }) {
  if (categorias.recursos_propios.nivel !== 'alto') return null;
  if (categorias.experiencia_previa.nivel !== 'bajo') return null;
  return {
    codigo: 'RESIND_CONFIANZA_SIN_HISTORIA',
    nivel: 'oportunidad',
    titulo: 'Confianza sin historia consolidada',
    evidencia: [`Recursos propios percibidos: ${categorias.recursos_propios.etiqueta}`, `Experiencia de recuperación previa: ${categorias.experiencia_previa.etiqueta}`],
    lectura: 'Hay una percepción optimista de la propia capacidad que no está necesariamente respaldada por una experiencia previa identificada — no es positivo ni negativo por sí mismo, es un matiz a explorar.',
    preguntas: ['¿Qué le hace sentir esa confianza, aunque no la haya puesto a prueba todavía?'],
  };
}

function reglaAFortalecer({ categorias }) {
  const claves = Object.keys(categorias);
  if (!claves.every((k) => categorias[k].nivel === 'bajo')) return null;
  return {
    codigo: 'RESIND_A_FORTALECER',
    nivel: 'profundizacion',
    titulo: 'Resiliencia individual a fortalecer',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Las respuestas muestran una percepción baja de la propia capacidad de adaptación y recuperación.',
    preguntas: ['¿Qué recursos o apoyos le ayudarían a sentirse con más capacidad de afrontar dificultades?'],
  };
}

// Exhaustivo: cubre el resto.
function reglaMixta({ categorias }) {
  const claves = Object.keys(categorias);
  const altas = claves.filter((k) => categorias[k].nivel === 'alto');
  const bajas = claves.filter((k) => categorias[k].nivel === 'bajo');
  if (altas.length === 3 || bajas.length === 3) return null;
  return {
    codigo: 'RESIND_MIXTA',
    nivel: 'oportunidad',
    titulo: 'Resiliencia individual con señales mixtas',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Las respuestas combinan señales de mayor y menor capacidad percibida — vale la pena explorarlo en la conversación.',
    preguntas: ['¿En qué tipo de dificultades se siente más capaz, y en cuáles menos?'],
  };
}

export const RESILIENCIA_INDIVIDUAL = {
  id: 'RESIND',
  nombre: 'Resiliencia Individual',
  descripcion: 'Capacidad de adaptación personal ante la adversidad, distinta de la resiliencia familiar (esfera C). Preguntas de diseño propio, inspiradas en el constructo del CD-RISC — no son los ítems originales.',
  fuente: 'docs/matriz-variables-indicadores.md#a-persona',
  preguntas: PREGUNTAS,
  reglas: [reglaConsolidadaConHistoria, reglaConfianzaSinHistoria, reglaAFortalecer, reglaMixta],
};
