// Exploración cultural e identitaria — diseño propio del equipo, esfera K.
// Cultural. Sin instrumento externo verificado.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#k-cultural.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Exploración cultural e identitaria.

const PREGUNTAS = [
  {
    id: 'identidad',
    texto: '¿Con qué grupo(s) cultural, étnico o territorial se identifica usted o su familia?',
    tipo: 'checklist',
    opciones: [
      { valor: 'indigena', etiqueta: 'Indígena' },
      { valor: 'afro', etiqueta: 'Afrocolombiano/Negro/Palenquero/Raizal' },
      { valor: 'rrom', etiqueta: 'Rrom/Gitano' },
      { valor: 'mestizo', etiqueta: 'Mestizo' },
      { valor: 'campesino', etiqueta: 'Campesino' },
      { valor: 'otro', etiqueta: 'Otro/Ninguno en particular' },
    ],
    notaAbierta: true,
    notaPlaceholder: 'Detalle (ej. pueblo o comunidad específica)',
  },
  {
    id: 'practicas',
    texto: '¿Qué costumbres, tradiciones o prácticas culturales son importantes para su familia?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No', nivel: 'bajo' },
      { valor: 'si', etiqueta: 'Sí', nivel: 'alto' },
    ],
    notaAbierta: true,
    notaPlaceholder: '¿Cuáles costumbres o tradiciones?',
  },
  {
    id: 'participacion',
    texto: '¿Participa en espacios o actividades culturales o comunitarias?',
    tipo: 'frecuencia',
    opciones: [
      { valor: 'nunca', etiqueta: 'Nunca', nivel: 'bajo' },
      { valor: 'a_veces', etiqueta: 'A veces', nivel: 'bajo' },
      { valor: 'frecuentemente', etiqueta: 'Frecuentemente', nivel: 'alto' },
      { valor: 'siempre', etiqueta: 'Siempre', nivel: 'alto' },
    ],
  },
  {
    id: 'discriminacion',
    texto: '¿Ha sentido alguna vez que su identidad cultural ha sido motivo de dificultad o discriminación?',
    avisoPrevio: 'Esta pregunta es delicada — formúlela con calma, sin juicio, y solo si el contexto de la conversación lo permite, igual que castigo_fisico en Prácticas de crianza.',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No', nivel: 'bajo' },
      { valor: 'si', etiqueta: 'Sí', nivel: 'alto' },
    ],
  },
  {
    id: 'transmision',
    texto: '¿Qué elementos de su cultura o tradición familiar le gustaría transmitir o fortalecer?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No', nivel: 'bajo' },
      { valor: 'si', etiqueta: 'Sí', nivel: 'alto' },
    ],
    notaAbierta: true,
    notaPlaceholder: '¿Qué elementos le gustaría transmitir?',
  },
];

function reglaIdentidadConBarrera({ categorias }) {
  const identidadMarcada = categorias.identidad.some((c) => c.valor !== 'otro');
  if (!identidadMarcada) return null;
  if (categorias.discriminacion.valor !== 'si') return null;
  return {
    codigo: 'CULTURAL_IDENTIDAD_CON_BARRERA',
    nivel: 'profundizacion',
    titulo: 'Identidad cultural con experiencia de barrera',
    evidencia: [`Identidad: ${categorias.identidad.map((c) => c.etiqueta).join(', ')}`, `Experiencia de discriminación: Sí`],
    lectura: 'Relevante para el enfoque diferencial del servicio; conecta con las esferas Socioeconómica y Territorial.',
    preguntas: ['¿Podría contarme más sobre esa situación, si se siente cómodo/a compartiéndola?'],
    estrategias: ['Tener en cuenta el enfoque diferencial al diseñar el acompañamiento con esta familia.'],
  };
}

function reglaContinuidadActiva({ categorias }) {
  if (categorias.practicas.valor !== 'si') return null;
  if (categorias.transmision.valor !== 'si') return null;
  return {
    codigo: 'CULTURAL_CONTINUIDAD_ACTIVA',
    nivel: 'fortaleza',
    titulo: 'Continuidad cultural activa',
    evidencia: ['Prácticas culturales presentes', 'Interés en transmitirlas presente'],
    lectura: 'Se identifica una transmisión cultural activa dentro de la familia, no solo prácticas aisladas.',
    preguntas: ['¿Cómo transmite la familia estas prácticas a las generaciones más jóvenes?'],
    estrategias: ['Reconocer y apoyar esta continuidad cultural como un recurso familiar.'],
  };
}

// Exhaustivo: cubre lo que las 2 reglas anteriores no capturan.
function reglaExploracionAbierta({ categorias }) {
  const identidadMarcada = categorias.identidad.some((c) => c.valor !== 'otro');
  const conBarrera = identidadMarcada && categorias.discriminacion.valor === 'si';
  const continuidad = categorias.practicas.valor === 'si' && categorias.transmision.valor === 'si';
  if (conBarrera || continuidad) return null;
  return {
    codigo: 'CULTURAL_EXPLORACION_ABIERTA',
    nivel: 'oportunidad',
    titulo: 'Dimensión cultural para seguir explorando',
    evidencia: [
      `Identidad: ${categorias.identidad.map((c) => c.etiqueta).join(', ') || 'sin marcar'}`,
      `Prácticas culturales: ${categorias.practicas.etiqueta}`,
      `Participación: ${categorias.participacion.etiqueta}`,
    ],
    lectura: 'Las respuestas no muestran un patrón marcado de barrera o continuidad activa — la dimensión cultural queda abierta para profundizar en la conversación.',
    preguntas: ['¿Qué tan presente siente que está su cultura o tradición familiar en su vida diaria?'],
  };
}

export const EXPLORACION_CULTURAL = {
  id: 'CULTURAL',
  nombre: 'Exploración Cultural e Identitaria',
  descripcion: 'Identidad, prácticas, tradiciones y participación cultural o comunitaria. Categoría de exploración de diseño propio del equipo.',
  fuente: 'docs/matriz-variables-indicadores.md#k-cultural',
  preguntas: PREGUNTAS,
  reglas: [reglaIdentidadConBarrera, reglaContinuidadActiva, reglaExploracionAbierta],
};
