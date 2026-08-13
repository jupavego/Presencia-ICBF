// Autoestima — híbrido inspirado en la Escala de Autoestima de Rosenberg,
// esfera A. Persona.
//
// Por qué es híbrido: la única validación en la carpeta es argentina, no
// colombiana, y no se confirmó el texto literal exacto de los 10 ítems en
// las páginas revisadas (ver docs/catalogo-instrumentos-psicosociales.md).
// No es un problema de licencia — la escala de Rosenberg es de amplia
// circulación académica — sino de suficiencia de la fuente disponible. Se
// conserva el constructo (autoestima global, unidimensional) y se
// redactan preguntas propias.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#a-persona.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Autoestima.

const FRECUENCIA = [
  { valor: 'nunca', etiqueta: 'Nunca', nivel: 'bajo' },
  { valor: 'a_veces', etiqueta: 'A veces', nivel: 'bajo' },
  { valor: 'frecuentemente', etiqueta: 'Frecuentemente', nivel: 'alto' },
  { valor: 'siempre', etiqueta: 'Siempre', nivel: 'alto' },
];

const PREGUNTAS = [
  {
    id: 'satisfaccion',
    texto: 'En general, ¿qué tan satisfecho/a se siente con la persona que es?',
    tipo: 'frecuencia',
    opciones: FRECUENCIA,
  },
  {
    id: 'cualidades',
    texto: '¿Qué tanto siente que tiene cualidades de las que puede sentirse orgulloso/a?',
    tipo: 'frecuencia',
    opciones: FRECUENCIA,
  },
  {
    id: 'momentos_menos',
    texto: '¿Hay momentos en que siente que no vale tanto como otras personas?',
    tipo: 'frecuencia',
    // Ítem inverso: aquí "alto" (Frecuentemente/Siempre) es la señal a explorar, no lo positivo.
    opciones: [
      { valor: 'nunca', etiqueta: 'Nunca', nivel: 'alto' },
      { valor: 'a_veces', etiqueta: 'A veces', nivel: 'alto' },
      { valor: 'frecuentemente', etiqueta: 'Frecuentemente', nivel: 'bajo' },
      { valor: 'siempre', etiqueta: 'Siempre', nivel: 'bajo' },
    ],
  },
  {
    id: 'respeto_propio',
    texto: '¿Cómo describiría el respeto que siente por sí mismo/a?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'bajo', etiqueta: 'Bajo', nivel: 'bajo' },
      { valor: 'medio', etiqueta: 'Medio', nivel: 'medio' },
      { valor: 'alto', etiqueta: 'Alto', nivel: 'alto' },
    ],
  },
];

const NOMBRE_PREGUNTA = {
  satisfaccion: 'Satisfacción general con uno/a mismo/a',
  cualidades: 'Cualidades propias reconocidas',
  momentos_menos: 'Momentos de sentirse menos que otros',
  respeto_propio: 'Respeto por sí mismo/a',
};

function esPositiva(cat) {
  return cat.nivel === 'alto';
}

function reglaConsolidada({ categorias }) {
  const claves = Object.keys(categorias);
  const positivas = claves.filter((k) => esPositiva(categorias[k]));
  if (positivas.length < 3) return null;
  return {
    codigo: 'AUTOESTIMA_CONSOLIDADA',
    nivel: 'fortaleza',
    titulo: 'Autoestima consolidada',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'La autopercepción general se muestra positiva en la mayoría de las dimensiones evaluadas.',
    preguntas: ['¿Qué reconoce como parte de esa valoración positiva de sí mismo/a?'],
    estrategias: ['Reconocer explícitamente este resultado como una fortaleza a mantener.'],
  };
}

function reglaFragilAnteMomentos({ categorias }) {
  if (!esPositiva(categorias.satisfaccion) || !esPositiva(categorias.cualidades)) return null;
  if (categorias.momentos_menos.nivel !== 'bajo') return null; // "bajo" aquí = Frecuentemente/Siempre, ver arriba
  return {
    codigo: 'AUTOESTIMA_FRAGIL_MOMENTOS',
    nivel: 'oportunidad',
    titulo: 'Autoestima frágil ante momentos específicos',
    evidencia: [`Satisfacción general: ${categorias.satisfaccion.etiqueta}`, `Cualidades reconocidas: ${categorias.cualidades.etiqueta}`, `Momentos de sentirse menos: ${categorias.momentos_menos.etiqueta}`],
    lectura: 'La autoimagen general es positiva, pero hay momentos específicos de mayor vulnerabilidad — matiz que un promedio simple no mostraría.',
    preguntas: ['¿En qué situaciones aparece más esa sensación de valer menos que otros?'],
  };
}

function reglaAFortalecer({ categorias }) {
  const claves = Object.keys(categorias);
  const positivas = claves.filter((k) => esPositiva(categorias[k]));
  if (positivas.length > 1) return null;
  return {
    codigo: 'AUTOESTIMA_A_FORTALECER',
    nivel: 'profundizacion',
    titulo: 'Autoestima a fortalecer',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Se identifican oportunidades de fortalecimiento en la autopercepción.',
    preguntas: ['¿Qué le ayudaría a sentirse mejor consigo mismo/a?'],
  };
}

// Exhaustivo: cubre lo que las 3 reglas anteriores no capturan.
function reglaMixta({ categorias }) {
  const claves = Object.keys(categorias);
  const positivas = claves.filter((k) => esPositiva(categorias[k]));
  if (positivas.length >= 3) return null; // consolidada
  if (positivas.length <= 1) return null; // a fortalecer
  return {
    codigo: 'AUTOESTIMA_MIXTA',
    nivel: 'oportunidad',
    titulo: 'Autoestima con señales mixtas',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Las respuestas combinan señales positivas y de alerta, sin ser consistentemente una cosa u otra — vale la pena explorarlo en la conversación.',
    preguntas: ['¿Qué partes de esa autopercepción siente más firmes, y cuáles más inestables?'],
  };
}

export const AUTOESTIMA = {
  id: 'AUTOESTIMA',
  nombre: 'Autoestima',
  descripcion: 'Valía personal percibida. Preguntas de diseño propio, inspiradas en el constructo de autoestima global de Rosenberg — no son los ítems originales.',
  fuente: 'docs/matriz-variables-indicadores.md#a-persona',
  preguntas: PREGUNTAS,
  reglas: [reglaConsolidada, reglaFragilAnteMomentos, reglaAFortalecer, reglaMixta],
};
