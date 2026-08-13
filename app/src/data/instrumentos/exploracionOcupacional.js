// Exploración ocupacional — diseño propio del equipo, esfera I. Ámbito
// Ocupacional. El modelo tipológico formal (RIASEC/Holland) ya se cubre en
// esfera B (híbrido); aquí se explora trayectoria, situación actual y
// barreras, sin depender de él.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#i-ámbito-ocupacional.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Exploración ocupacional.

const PREGUNTAS = [
  {
    id: 'trayectoria',
    texto: '¿En qué ha trabajado o se ha ocupado a lo largo de su vida?',
    tipo: 'checklist',
    opciones: [
      { valor: 'formal', etiqueta: 'Empleo formal' },
      { valor: 'informal', etiqueta: 'Trabajo informal/independiente' },
      { valor: 'hogar', etiqueta: 'Labores del hogar/cuidado' },
      { valor: 'sin_experiencia', etiqueta: 'Sin experiencia laboral' },
      { valor: 'otro', etiqueta: 'Otro' },
    ],
    notaAbierta: true,
    notaPlaceholder: 'Detalle de lo marcado',
  },
  {
    id: 'situacion',
    texto: '¿Cómo describiría su situación laboral u ocupacional actual?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'sin_ocupacion', etiqueta: 'Sin ocupación' },
      { valor: 'buscando', etiqueta: 'Buscando' },
      { valor: 'inestable', etiqueta: 'Ocupación inestable' },
      { valor: 'estable', etiqueta: 'Ocupación estable' },
    ],
  },
  {
    id: 'satisfaccion',
    texto: '¿Qué tan satisfecho/a está con su situación laboral u ocupacional actual?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'poco', etiqueta: 'Poco satisfecho/a' },
      { valor: 'medio', etiqueta: 'Medianamente satisfecho/a' },
      { valor: 'mucho', etiqueta: 'Muy satisfecho/a' },
    ],
  },
  {
    id: 'barreras',
    texto: '¿Qué dificultades ha tenido para conseguir o mantener un trabajo o actividad económica?',
    tipo: 'checklist',
    opciones: [
      { valor: 'formacion', etiqueta: 'Formación/estudios' },
      { valor: 'documentacion', etiqueta: 'Documentación' },
      { valor: 'cuidado', etiqueta: 'Cuidado de otros' },
      { valor: 'transporte', etiqueta: 'Transporte/geográfica' },
      { valor: 'discriminacion', etiqueta: 'Discriminación/edad' },
      { valor: 'ninguna', etiqueta: 'Ninguna' },
    ],
  },
  {
    id: 'apoyo_necesario',
    texto: '¿Qué necesitaría para acceder a una oportunidad laboral u ocupacional que le interese?',
    tipo: 'checklist',
    opciones: [
      { valor: 'formacion', etiqueta: 'Formación' },
      { valor: 'documentos', etiqueta: 'Documentos' },
      { valor: 'redes', etiqueta: 'Redes/contactos' },
      { valor: 'recursos', etiqueta: 'Recursos económicos' },
      { valor: 'cuidado', etiqueta: 'Cuidado de otros' },
      { valor: 'no_aplica', etiqueta: 'No aplica' },
    ],
    notaAbierta: true,
    notaPlaceholder: 'Detalle de lo marcado',
  },
];

function contarBarreras(cat) {
  return cat.filter((c) => c.valor !== 'ninguna').length;
}

function apoyoSolicitado(categoriaApoyo) {
  return categoriaApoyo.filter((c) => c.valor !== 'no_aplica').map((c) => c.etiqueta);
}

function reglaBarreraMultiple({ categorias }) {
  if (!['sin_ocupacion', 'buscando'].includes(categorias.situacion.valor)) return null;
  if (contarBarreras(categorias.barreras) < 2) return null;
  const barreras = categorias.barreras.filter((c) => c.valor !== 'ninguna').map((c) => c.etiqueta);
  const apoyos = apoyoSolicitado(categorias.apoyo_necesario);
  const evidencia = [`Situación: ${categorias.situacion.etiqueta}`, `Barreras: ${barreras.join(', ')}`];
  if (apoyos.length > 0) evidencia.push(`Apoyo solicitado: ${apoyos.join(', ')}`);
  return {
    codigo: 'OCUP_BARRERA_MULTIPLE',
    nivel: 'oportunidad',
    titulo: 'Barrera múltiple de acceso ocupacional',
    evidencia,
    lectura: 'Se identifican varias barreras simultáneas para el acceso ocupacional, no una sola dificultad aislada.',
    preguntas: ['¿Cuál de estas barreras siente que es la más urgente de resolver primero?'],
    estrategias: apoyos.length > 0
      ? [`Explorar rutas institucionales concretas para el apoyo solicitado (${apoyos.join(', ')}).`]
      : ['Explorar rutas institucionales o redes que puedan apoyar las barreras identificadas.'],
  };
}

function reglaEstabilidadSinSatisfaccion({ categorias }) {
  if (categorias.situacion.valor !== 'estable') return null;
  if (categorias.satisfaccion.valor !== 'poco') return null;
  return {
    codigo: 'OCUP_ESTABLE_SIN_SATISFACCION',
    nivel: 'oportunidad',
    titulo: 'Estabilidad sin satisfacción',
    evidencia: [`Situación: ${categorias.situacion.etiqueta}`, `Satisfacción: ${categorias.satisfaccion.etiqueta}`],
    lectura: 'Tener una ocupación estable no implica satisfacción con ella — matiz que la sola pregunta de "situación actual" no capturaría.',
    preguntas: ['¿Qué le gustaría que fuera distinto en su situación ocupacional actual?'],
  };
}

function reglaEstableSatisfecho({ categorias }) {
  if (categorias.situacion.valor !== 'estable') return null;
  if (categorias.satisfaccion.valor !== 'mucho') return null;
  return {
    codigo: 'OCUP_ESTABLE_SATISFECHO',
    nivel: 'fortaleza',
    titulo: 'Situación ocupacional estable y satisfactoria',
    evidencia: [`Situación: ${categorias.situacion.etiqueta}`, `Satisfacción: ${categorias.satisfaccion.etiqueta}`],
    lectura: 'La persona reporta estabilidad y satisfacción con su situación ocupacional actual.',
    preguntas: ['¿Qué ha contribuido a esta estabilidad?'],
  };
}

// Cubre lo que las 3 reglas anteriores no capturan (sin_ocupacion/buscando
// con 0-1 barrera, o inestable en cualquier satisfacción).
function reglaMixta({ categorias }) {
  const yaClasificada = ['sin_ocupacion', 'buscando'].includes(categorias.situacion.valor)
    ? contarBarreras(categorias.barreras) >= 2
    : categorias.situacion.valor === 'estable';
  if (yaClasificada) return null;
  return {
    codigo: 'OCUP_MIXTA',
    nivel: 'oportunidad',
    titulo: 'Situación ocupacional a explorar',
    evidencia: [`Situación: ${categorias.situacion.etiqueta}`, `Satisfacción: ${categorias.satisfaccion.etiqueta}`],
    lectura: 'La combinación de situación y satisfacción no encaja en un patrón definido — vale la pena profundizar en la conversación.',
    preguntas: ['¿Cómo describiría en sus palabras su situación ocupacional actual?'],
  };
}

export const EXPLORACION_OCUPACIONAL = {
  id: 'OCUP',
  nombre: 'Exploración Ocupacional',
  descripcion: 'Trayectoria laboral, situación actual y barreras de acceso o permanencia. Categoría de exploración de diseño propio del equipo.',
  fuente: 'docs/matriz-variables-indicadores.md#i-ámbito-ocupacional',
  preguntas: PREGUNTAS,
  reglas: [reglaBarreraMultiple, reglaEstabilidadSinSatisfaccion, reglaEstableSatisfecho, reglaMixta],
};
