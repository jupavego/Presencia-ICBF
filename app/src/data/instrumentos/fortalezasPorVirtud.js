// Fortalezas de carácter por virtud — híbrido inspirado en la taxonomía de
// Peterson & Seligman (2004), esfera B. Intereses y Potencial.
//
// Por qué es híbrido: VIA GACS-24/SSS quedan bloqueados por licencia de
// investigación grupal. La taxonomía de 24 fortalezas agrupadas en 6
// virtudes es de dominio académico público — lo restringido es el
// instrumento de medición del VIA Institute, no la taxonomía en sí. Se
// redactan preguntas propias, una por virtud — salvo Justicia, que se
// exploró originalmente con una sola pregunta que mezclaba equidad y
// trabajo en equipo; se separó en dos preguntas porque son fortalezas
// distintas dentro de esa virtud (equidad/justicia y trabajo en
// equipo/ciudadanía son dos de las 3 fortalezas de Justicia en la
// taxonomía original).
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#b-intereses-y-potencial.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Fortalezas de carácter por virtud.

const PREGUNTAS = [
  {
    id: 'sabiduria',
    texto: 'De curiosidad, amor por el aprendizaje, creatividad o perspectiva, ¿cuál reconoce más en usted?',
    tipo: 'checklist',
    opciones: [
      { valor: 'curiosidad', etiqueta: 'Curiosidad' },
      { valor: 'aprendizaje', etiqueta: 'Amor por el aprendizaje' },
      { valor: 'creatividad', etiqueta: 'Creatividad' },
      { valor: 'perspectiva', etiqueta: 'Perspectiva' },
    ],
  },
  {
    id: 'coraje',
    texto: '¿En qué situación reciente mostró valentía, perseverancia u honestidad?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No', nivel: 'bajo' },
      { valor: 'parcial', etiqueta: 'Parcialmente', nivel: 'medio' },
      { valor: 'si', etiqueta: 'Sí', nivel: 'alto' },
    ],
    notaAbierta: true,
    notaPlaceholder: '¿Cuál fue esa situación?',
  },
  {
    id: 'humanidad',
    texto: '¿Cómo expresa el cuidado o cariño hacia otras personas?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'acciones', etiqueta: 'Con acciones concretas', nivel: 'alto' },
      { valor: 'palabras', etiqueta: 'Con palabras o afecto', nivel: 'alto' },
      { valor: 'ambas', etiqueta: 'Ambas', nivel: 'alto' },
      { valor: 'no_se', etiqueta: 'No sabría decir', nivel: 'bajo' },
    ],
  },
  {
    id: 'justicia_equidad',
    texto: '¿Qué tan importante es para usted actuar con justicia y equidad en sus relaciones cotidianas?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'central', etiqueta: 'Central', nivel: 'alto' },
      { valor: 'presente', etiqueta: 'Presente', nivel: 'alto' },
      { valor: 'poco_presente', etiqueta: 'Poco presente', nivel: 'bajo' },
    ],
  },
  {
    id: 'justicia_equipo',
    texto: '¿Qué papel juega el trabajo en equipo en su vida?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'central', etiqueta: 'Central', nivel: 'alto' },
      { valor: 'presente', etiqueta: 'Presente', nivel: 'alto' },
      { valor: 'poco_presente', etiqueta: 'Poco presente', nivel: 'bajo' },
    ],
  },
  {
    id: 'templanza',
    texto: '¿Logra mantener el equilibrio o manejar sus impulsos en momentos difíciles?',
    tipo: 'frecuencia',
    opciones: [
      { valor: 'nunca', etiqueta: 'Nunca', nivel: 'bajo' },
      { valor: 'a_veces', etiqueta: 'A veces', nivel: 'bajo' },
      { valor: 'frecuentemente', etiqueta: 'Frecuentemente', nivel: 'alto' },
      { valor: 'siempre', etiqueta: 'Siempre', nivel: 'alto' },
    ],
  },
  {
    id: 'trascendencia',
    texto: '¿Tiene algo que le da sentido o esperanza en momentos difíciles?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No', nivel: 'bajo' },
      { valor: 'parcial', etiqueta: 'Parcialmente', nivel: 'medio' },
      { valor: 'si', etiqueta: 'Sí', nivel: 'alto' },
    ],
    notaAbierta: true,
    notaPlaceholder: '¿Qué es eso que le da sentido o esperanza?',
  },
];

const NOMBRE_VIRTUD = {
  sabiduria: 'Sabiduría',
  coraje: 'Coraje',
  humanidad: 'Humanidad',
  justicia: 'Justicia',
  templanza: 'Templanza',
  trascendencia: 'Trascendencia',
};

// Más de una pregunta puede pertenecer a la misma virtud (ver Justicia,
// separada en equidad + trabajo en equipo).
const VIRTUD_DE_PREGUNTA = {
  sabiduria: 'sabiduria',
  coraje: 'coraje',
  humanidad: 'humanidad',
  justicia_equidad: 'justicia',
  justicia_equipo: 'justicia',
  templanza: 'templanza',
  trascendencia: 'trascendencia',
};

const VIRTUDES = [...new Set(Object.values(VIRTUD_DE_PREGUNTA))];

// "Reconocida" tiene un criterio distinto por tipo de pregunta.
function reconocida(id, cat) {
  if (id === 'sabiduria') return Array.isArray(cat) && cat.length > 0;
  return cat.nivel === 'alto';
}

// Una virtud está reconocida si alguna de sus preguntas lo está (ej.
// Justicia con equidad="Poco presente" pero equipo="Central" ya cuenta).
function virtudReconocida(virtud, categorias) {
  return Object.keys(VIRTUD_DE_PREGUNTA)
    .filter((id) => VIRTUD_DE_PREGUNTA[id] === virtud)
    .some((id) => categorias[id] !== undefined && reconocida(id, categorias[id]));
}

function reglaPerfilAmplio({ categorias }) {
  const reconocidas = VIRTUDES.filter((v) => virtudReconocida(v, categorias));
  if (reconocidas.length < 4) return null;
  return {
    codigo: 'FORTVIRT_PERFIL_AMPLIO',
    nivel: 'fortaleza',
    titulo: 'Perfil de fortalezas amplio',
    evidencia: reconocidas.map((v) => NOMBRE_VIRTUD[v]),
    lectura: 'La persona reconoce fortalezas propias distribuidas en la mayoría de las 6 virtudes de la taxonomía.',
    preguntas: ['¿Cuál de estas fortalezas siente que usa con más frecuencia en su día a día?'],
    estrategias: ['Reconocer explícitamente esta amplitud de fortalezas con la persona.'],
  };
}

// Cubre 1-3 virtudes reconocidas (exhaustivo junto con las otras 2 reglas:
// 0 → sin reconocer, 1-3 → focalizadas, 4-6 → perfil amplio).
function reglaFocalizadas({ categorias }) {
  const reconocidas = VIRTUDES.filter((v) => virtudReconocida(v, categorias));
  if (reconocidas.length === 0 || reconocidas.length > 3) return null;
  return {
    codigo: 'FORTVIRT_FOCALIZADAS',
    nivel: 'oportunidad',
    titulo: `Fortalezas focalizadas en ${reconocidas.map((v) => NOMBRE_VIRTUD[v]).join(', ')}`,
    evidencia: reconocidas.map((v) => NOMBRE_VIRTUD[v]),
    lectura: 'Las fortalezas reconocidas se concentran en un subconjunto de virtudes — insumo directo para orientar hacia actividades afines a esas fortalezas.',
    preguntas: [`¿Cómo podría la persona usar más estas fortalezas (${reconocidas.map((v) => NOMBRE_VIRTUD[v]).join(', ')}) en su vida diaria?`],
  };
}

function reglaSinFortalezas({ categorias }) {
  const reconocidas = VIRTUDES.filter((v) => virtudReconocida(v, categorias));
  if (reconocidas.length > 0) return null;
  return {
    codigo: 'FORTVIRT_SIN_RECONOCER',
    nivel: 'profundizacion',
    titulo: 'Sin fortalezas reconocidas en esta exploración',
    evidencia: ['Ninguna de las 6 virtudes mostró evidencia positiva en esta aplicación'],
    lectura: 'No se debe asumir ausencia real de fortalezas — es más probable que las preguntas no hayan logrado capturarlas; señal para profundizar en conversación abierta, no una conclusión sobre la persona.',
    preguntas: ['¿Qué le han dicho otras personas que se le da bien o que valoran de usted?'],
  };
}

export const FORTALEZAS_POR_VIRTUD = {
  id: 'FORTVIRT',
  nombre: 'Fortalezas de Carácter por Virtud',
  descripcion: 'Fortalezas que la persona reconoce en sí misma, agrupadas en las 6 virtudes de la taxonomía de Peterson & Seligman. Preguntas de diseño propio — no son los ítems del VIA Institute.',
  fuente: 'docs/matriz-variables-indicadores.md#b-intereses-y-potencial',
  preguntas: PREGUNTAS,
  reglas: [reglaPerfilAmplio, reglaFocalizadas, reglaSinFortalezas],
};
