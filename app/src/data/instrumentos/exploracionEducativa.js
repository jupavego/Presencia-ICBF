// Exploración educativa — diseño propio del equipo, esfera H. Educación.
// Sin instrumento externo verificado: se prioriza trayectoria + motivación
// + barreras, observables sin necesidad de un instrumento validado (se
// descartó deliberadamente un modelo formal de "estilos de aprendizaje" —
// evidencia psicométrica débil, ver mapa teórico).
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#h-educación.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Exploración educativa.

const PREGUNTAS = [
  {
    id: 'nivel',
    texto: '¿Hasta qué nivel educativo llegó usted?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'ninguno', etiqueta: 'Ninguno' },
      { valor: 'primaria', etiqueta: 'Primaria' },
      { valor: 'secundaria', etiqueta: 'Secundaria' },
      { valor: 'tecnico', etiqueta: 'Técnico/Tecnológico' },
      { valor: 'universitario', etiqueta: 'Universitario' },
      { valor: 'posgrado', etiqueta: 'Posgrado' },
    ],
  },
  {
    id: 'le_gustaria',
    texto: '¿Le gustaría continuar o retomar estudios?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No' },
      { valor: 'si', etiqueta: 'Sí' },
    ],
    notaAbierta: true,
    notaPlaceholder: '¿Qué le gustaría estudiar?',
  },
  {
    id: 'motivo_dejar',
    texto: '¿Qué lo/la llevó a dejar de estudiar, si fue el caso?',
    tipo: 'checklist',
    opciones: [
      { valor: 'economico', etiqueta: 'Económico' },
      { valor: 'familiar', etiqueta: 'Familiar/cuidado' },
      { valor: 'laboral', etiqueta: 'Laboral' },
      { valor: 'academico', etiqueta: 'Académico' },
      { valor: 'geografico', etiqueta: 'Geográfico/acceso' },
      { valor: 'no_aplica', etiqueta: 'No aplica / sigue estudiando' },
    ],
    notaAbierta: true,
    notaPlaceholder: 'Detalle de lo marcado',
  },
  {
    id: 'importancia',
    texto: '¿Qué tan importante considera la educación para su proyecto de vida o el de su familia?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'poco', etiqueta: 'Poco importante' },
      { valor: 'importante', etiqueta: 'Importante' },
      { valor: 'muy_importante', etiqueta: 'Muy importante' },
    ],
  },
  {
    id: 'dificultades',
    texto: '¿Qué dificultades ha encontrado —o encuentran sus hijos/as— para estudiar o mantenerse estudiando?',
    tipo: 'checklist',
    opciones: [
      { valor: 'economica', etiqueta: 'Económica' },
      { valor: 'geografica', etiqueta: 'Geográfica/transporte' },
      { valor: 'cuidado', etiqueta: 'Cuidado de otros' },
      { valor: 'institucional', etiqueta: 'Institucional' },
      { valor: 'ninguna', etiqueta: 'Ninguna' },
    ],
  },
  {
    id: 'apoyo_necesario',
    texto: '¿Qué apoyo necesitaría para retomar o continuar su proceso educativo?',
    tipo: 'checklist',
    opciones: [
      { valor: 'economico', etiqueta: 'Económico' },
      { valor: 'cupo', etiqueta: 'Cupo/acceso' },
      { valor: 'cuidado', etiqueta: 'Cuidado de otros' },
      { valor: 'informacion', etiqueta: 'Información sobre oferta educativa' },
      { valor: 'no_aplica', etiqueta: 'No aplica' },
    ],
    notaAbierta: true,
    notaPlaceholder: 'Detalle de lo marcado',
  },
];

function hayBarreraActiva(categoriaDificultades) {
  return categoriaDificultades.some((c) => c.valor !== 'ninguna');
}

function reglaSinInteres({ categorias }) {
  if (categorias.le_gustaria.valor !== 'no') return null;
  return {
    codigo: 'EDU_SIN_INTERES',
    nivel: 'oportunidad',
    titulo: 'Sin interés actual en retomar estudios',
    evidencia: [`Nivel educativo: ${categorias.nivel.etiqueta}`, `¿Le gustaría continuar?: No`, `Importancia de la educación: ${categorias.importancia.etiqueta}`],
    lectura: 'La persona no manifiesta interés actual en continuar o retomar estudios.',
    preguntas: ['¿Hay algo que podría cambiar esa perspectiva más adelante?'],
  };
}

function apoyoSolicitado(categoriaApoyo) {
  return categoriaApoyo.filter((c) => c.valor !== 'no_aplica').map((c) => c.etiqueta);
}

function reglaInteresConBarrera({ categorias }) {
  if (categorias.le_gustaria.valor !== 'si') return null;
  if (!hayBarreraActiva(categorias.dificultades)) return null;
  const barreras = categorias.dificultades.filter((c) => c.valor !== 'ninguna').map((c) => c.etiqueta);
  const apoyos = apoyoSolicitado(categorias.apoyo_necesario);
  const evidencia = [`¿Le gustaría continuar?: Sí`, `Dificultades: ${barreras.join(', ')}`];
  if (apoyos.length > 0) evidencia.push(`Apoyo solicitado: ${apoyos.join(', ')}`);
  return {
    codigo: 'EDU_INTERES_CON_BARRERA',
    nivel: 'oportunidad',
    titulo: 'Interés educativo con barreras activas',
    evidencia,
    lectura: 'Hay interés educativo identificado junto con obstáculos concretos — insumo directo para orientar hacia recursos o rutas de apoyo.',
    preguntas: ['¿Cuál de estas dificultades siente que es la más urgente de resolver?'],
    estrategias: apoyos.length > 0
      ? [`Explorar rutas institucionales concretas para el apoyo solicitado (${apoyos.join(', ')}).`]
      : ['Explorar recursos o rutas institucionales disponibles para las barreras identificadas.'],
  };
}

function reglaIncongruencia({ categorias }) {
  if (categorias.le_gustaria.valor !== 'si') return null;
  if (categorias.importancia.valor !== 'poco') return null;
  return {
    codigo: 'EDU_INCONGRUENCIA',
    nivel: 'oportunidad',
    titulo: 'Interés educativo con baja importancia percibida',
    evidencia: [`¿Le gustaría continuar?: Sí`, `Importancia de la educación: ${categorias.importancia.etiqueta}`],
    lectura: 'Combinación que vale la pena conversar, no resolver automáticamente — puede reflejar ambivalencia real, no un error de captura.',
    preguntas: ['¿Qué hace que la educación se sienta poco importante en este momento, aunque le gustaría retomarla?'],
  };
}

// Exhaustivo dentro de "le_gustaria = Sí": cubre lo que no capturan las
// otras 2 reglas condicionadas a "Sí".
function reglaInteresSinComplicaciones({ categorias }) {
  if (categorias.le_gustaria.valor !== 'si') return null;
  if (hayBarreraActiva(categorias.dificultades)) return null;
  if (categorias.importancia.valor === 'poco') return null;
  return {
    codigo: 'EDU_INTERES_SIN_COMPLICACIONES',
    nivel: 'fortaleza',
    titulo: 'Interés educativo sin barreras identificadas',
    evidencia: [`¿Le gustaría continuar?: Sí`, `Importancia: ${categorias.importancia.etiqueta}`, 'Sin dificultades marcadas'],
    lectura: 'Hay interés y valoración positiva de la educación, sin barreras activas identificadas en esta exploración.',
    preguntas: ['¿Qué pasos concretos ayudarían a avanzar hacia retomar los estudios?'],
    estrategias: ['Apoyar activamente la conexión con oferta educativa disponible, dado que no hay barreras reportadas.'],
  };
}

export const EXPLORACION_EDUCATIVA = {
  id: 'EDU',
  nombre: 'Exploración Educativa',
  descripcion: 'Trayectoria escolar, motivación y barreras de acceso o permanencia. Categoría de exploración de diseño propio del equipo.',
  fuente: 'docs/matriz-variables-indicadores.md#h-educación',
  preguntas: PREGUNTAS,
  reglas: [reglaSinInteres, reglaInteresConBarrera, reglaIncongruencia, reglaInteresSinComplicaciones],
};
