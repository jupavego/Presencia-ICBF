// Exploración de Proyecto de Vida — diseño propio del equipo, esfera M.
// Integra 6 de los 11 componentes que pide la sección 12 del prompt
// maestro (intereses, aptitudes, actitudes, valores, aspiraciones,
// oportunidades/barreras); los otros 5 (fortalezas, recursos personales,
// recursos relacionales, contexto) ya están cubiertos por otras
// herramientas de esferas A, B, D/F y J/L — no se repiten aquí.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#m-proyecto-de-vida.
// Reglas de interacción: docs/matriz-variables-indicadores.md#banco-de-preguntas-propuesto-diseño-propio-para-las-seis-categorías-nuevas.

const PRESENCIA = [
  { valor: 'no', etiqueta: 'No', nivel: 'bajo' },
  { valor: 'si', etiqueta: 'Sí', nivel: 'alto' },
];

const PREGUNTAS = [
  // Intereses
  { id: 'interes_disfrute', texto: '¿Tiene actividades que disfruta hacer, aunque no le paguen por ellas?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Cuáles?' },
  { id: 'interes_aprender', texto: '¿Hay algo que le gustaría aprender o hacer si tuviera el tiempo o los recursos?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Qué le gustaría aprender o hacer?' },
  { id: 'interes_retomar', texto: '¿Hacía algo de niño/a o joven que hoy ya no hace y le gustaría retomar?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Qué era?' },
  // Aptitudes y habilidades
  { id: 'aptitud_reconocimiento', texto: '¿En qué le dicen las demás personas que usted es bueno/a?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿En qué?' },
  { id: 'aptitud_util', texto: '¿Sabe hacer algo que le ha servido para resolver situaciones difíciles?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Qué sabe hacer?' },
  { id: 'aptitud_fortalecer', texto: '¿Hay alguna habilidad que le gustaría fortalecer?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Cuál habilidad?' },
  // Actitudes
  { id: 'actitud_posibilidad', texto: 'Cuando piensa en su futuro y el de su familia, ¿qué tan posible siente que es mejorar su situación actual?', tipo: 'seleccion_unica', opciones: [
    { valor: 'poco', etiqueta: 'Poco posible', nivel: 'bajo' },
    { valor: 'medio', etiqueta: 'Medianamente posible', nivel: 'medio' },
    { valor: 'mucho', etiqueta: 'Muy posible', nivel: 'alto' },
  ] },
  { id: 'actitud_influencia', texto: '¿Qué tanto siente que las decisiones que toma hoy influyen en cómo estará en unos años?', tipo: 'seleccion_unica', opciones: [
    { valor: 'poco', etiqueta: 'Poco', nivel: 'bajo' },
    { valor: 'medio', etiqueta: 'Medianamente', nivel: 'medio' },
    { valor: 'mucho', etiqueta: 'Mucho', nivel: 'alto' },
  ] },
  // Valores
  { id: 'valores_guia', texto: '¿Qué es lo más importante para usted a la hora de tomar una decisión importante?', tipo: 'checklist', opciones: [
    { valor: 'familia', etiqueta: 'Familia' },
    { valor: 'estabilidad', etiqueta: 'Estabilidad económica' },
    { valor: 'libertad', etiqueta: 'Libertad/autonomía' },
    { valor: 'honestidad', etiqueta: 'Honestidad' },
    { valor: 'fe', etiqueta: 'Fe/espiritualidad' },
    { valor: 'otro', etiqueta: 'Otro' },
  ], notaAbierta: true, notaPlaceholder: 'Si marcó "Otro", especifique' },
  { id: 'valores_autoimagen', texto: '¿Qué le gustaría que las demás personas dijeran de usted?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Qué le gustaría que dijeran?' },
  // Aspiraciones
  { id: 'aspiracion_corto', texto: '¿Tiene una meta o idea de cómo le gustaría que fuera su vida o la de su familia en un año?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Cuál es esa meta?' },
  { id: 'aspiracion_largo', texto: '¿Tiene una meta o idea de cómo le gustaría que fuera su vida o la de su familia en cinco años?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Cuál es esa meta?' },
  { id: 'aspiracion_aplazada', texto: '¿Hay alguna meta que ha tenido que aplazar?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Cuál meta?' },
  // Oportunidades y barreras
  { id: 'oportunidad', texto: '¿Identifica cosas de su entorno que le facilitarían avanzar hacia esa meta?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Cuáles?' },
  { id: 'barrera', texto: '¿Identifica obstáculos para lograrlo?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Cuáles obstáculos?' },
  { id: 'intento_previo', texto: '¿Ha intentado antes acercarse a esa meta?', tipo: 'presencia', opciones: PRESENCIA, notaAbierta: true, notaPlaceholder: '¿Qué intentó?' },
];

function esSi(cat) {
  return cat.valor === 'si';
}

function reglaBarreraSinOportunidad({ categorias }) {
  if (!esSi(categorias.barrera)) return null;
  if (esSi(categorias.oportunidad)) return null;
  return {
    codigo: 'PROYVIDA_BARRERA_SIN_OPORTUNIDAD',
    nivel: 'oportunidad',
    titulo: 'Barrera sin contrapeso de oportunidad',
    evidencia: ['Barrera identificada: Sí', 'Oportunidad identificada: No'],
    lectura: 'Se identifica un obstáculo para avanzar hacia la meta, sin que se hayan identificado facilitadores del entorno que lo contrarresten.',
    preguntas: ['¿Qué o quién podría ayudar a superar ese obstáculo?'],
    estrategias: ['Explorar activamente con la persona posibles recursos del entorno —redes, instituciones, apoyos— que no haya considerado todavía.'],
  };
}

function reglaProyectoSinFormular({ categorias }) {
  if (esSi(categorias.aspiracion_corto) || esSi(categorias.aspiracion_largo)) return null;
  return {
    codigo: 'PROYVIDA_SIN_FORMULAR',
    nivel: 'profundizacion',
    titulo: 'Proyecto de vida sin formular todavía',
    evidencia: ['Aspiración a un año: No', 'Aspiración a cinco años: No'],
    lectura: 'No se identifica una meta o aspiración formulada, ni a corto ni a largo plazo — es información para la conversación, no una carencia a señalar directamente.',
    preguntas: ['Si pudiera imaginar su vida un poco mejor el próximo año, ¿qué sería distinto?'],
    estrategias: ['Dedicar un espacio específico del acompañamiento a explorar el proyecto de vida, sin presionar por una respuesta inmediata.'],
  };
}

function reglaProyectoConsolidado({ categorias }) {
  if (!esSi(categorias.aspiracion_corto) || !esSi(categorias.aspiracion_largo)) return null;
  if (!esSi(categorias.oportunidad)) return null;
  return {
    codigo: 'PROYVIDA_CONSOLIDADO',
    nivel: 'fortaleza',
    titulo: 'Proyecto de vida con metas y oportunidades identificadas',
    evidencia: ['Aspiración a un año: Sí', 'Aspiración a cinco años: Sí', 'Oportunidad identificada: Sí'],
    lectura: 'La persona formula metas a corto y largo plazo, y además identifica oportunidades del entorno para avanzar hacia ellas.',
    preguntas: ['¿Qué primer paso concreto podría dar hacia esa meta?'],
    estrategias: ['Apoyar la construcción de un plan de acción concreto, aprovechando las oportunidades ya identificadas.'],
  };
}

function reglaIntentoPrevioConBarrera({ categorias }) {
  if (!esSi(categorias.intento_previo)) return null;
  if (!esSi(categorias.barrera)) return null;
  return {
    codigo: 'PROYVIDA_INTENTO_CON_BARRERA',
    nivel: 'oportunidad',
    titulo: 'Intento previo con barrera identificada',
    evidencia: ['Intento previo: Sí', 'Barrera identificada: Sí'],
    lectura: 'La persona ya intentó acercarse a esta meta antes y hoy identifica un obstáculo — vale la pena explorar qué pasó en ese intento anterior para entender la barrera actual con más detalle.',
    preguntas: ['¿Qué pasó la vez anterior que intentó esto? ¿Qué fue diferente entonces?'],
  };
}

function reglaFortalezasPropiasReconocidas({ categorias }) {
  const reconoce = esSi(categorias.aptitud_reconocimiento) || esSi(categorias.aptitud_util);
  if (!reconoce) return null;
  return {
    codigo: 'PROYVIDA_FORTALEZAS_RECONOCIDAS',
    nivel: 'fortaleza',
    titulo: 'Aptitudes propias reconocidas',
    evidencia: [`Reconocimiento externo: ${categorias.aptitud_reconocimiento.etiqueta}`, `Habilidad útil en dificultades: ${categorias.aptitud_util.etiqueta}`],
    lectura: 'La persona identifica capacidades propias reconocidas por otros o útiles frente a dificultades — recurso directo para apoyar el proyecto de vida.',
    preguntas: ['¿Cómo podría usar esa capacidad en la meta que está considerando?'],
  };
}

export const PROYECTO_DE_VIDA = {
  id: 'PROYVIDA',
  nombre: 'Exploración de Proyecto de Vida',
  descripcion: 'Intereses, aptitudes, actitudes, valores, aspiraciones y oportunidades/barreras percibidas. Integra fortalezas (esfera B), autoeficacia (A), redes (D/F) y contexto (J/L) ya explorados en otras herramientas. Categoría de exploración de diseño propio.',
  fuente: 'docs/matriz-variables-indicadores.md#m-proyecto-de-vida',
  preguntas: PREGUNTAS,
  reglas: [reglaBarreraSinOportunidad, reglaProyectoSinFormular, reglaProyectoConsolidado, reglaIntentoPrevioConBarrera, reglaFortalezasPropiasReconocidas],
};
