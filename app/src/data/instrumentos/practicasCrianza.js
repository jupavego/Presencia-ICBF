// Prácticas de crianza — híbrido inspirado en las 5 dimensiones del
// Alabama Parenting Questionnaire (Frick, 1991), esfera E. Crianza y
// Cuidado.
//
// Por qué es híbrido: la licencia del APQ exige no modificar su redacción,
// instrucciones ni formato de respuesta — así que ni siquiera traducirlo
// es viable sin autorización. Se conservan las 5 dimensiones (dominio
// académico) y se redactan preguntas propias en español.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#e-crianza-y-cuidado.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Prácticas de crianza.

const FRECUENCIA = [
  { valor: 'nunca', etiqueta: 'Nunca', nivel: 'bajo' },
  { valor: 'a_veces', etiqueta: 'A veces', nivel: 'bajo' },
  { valor: 'frecuentemente', etiqueta: 'Frecuentemente', nivel: 'alto' },
  { valor: 'siempre', etiqueta: 'Siempre', nivel: 'alto' },
];

const PREGUNTAS = [
  {
    id: 'involucramiento',
    texto: '¿Con qué frecuencia comparte actividades agradables con sus hijos/as —jugar, conversar, elogiarlos?',
    tipo: 'frecuencia',
    opciones: FRECUENCIA,
  },
  {
    id: 'supervision',
    texto: '¿Sabe generalmente dónde están y con quién están sus hijos/as cuando no está con ellos?',
    tipo: 'frecuencia',
    opciones: FRECUENCIA,
  },
  {
    id: 'disciplina',
    texto: 'Cuando su hijo/a se porta mal, ¿qué suele hacer usted?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'conversar', etiqueta: 'Conversar o explicar', positiva: true },
      { valor: 'quitar_privilegio', etiqueta: 'Quitar un privilegio', positiva: true },
      { valor: 'ignorar', etiqueta: 'Ignorar', positiva: false },
      { valor: 'gritar', etiqueta: 'Gritar o regañar fuerte', positiva: false },
      { valor: 'castigo_fisico', etiqueta: 'Castigo físico', positiva: false },
    ],
  },
  {
    id: 'consistencia',
    texto: '¿Las normas y consecuencias en el hogar se mantienen igual, o cambian según el momento o quién esté presente?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'igual', etiqueta: 'Se mantienen igual', positiva: true },
      { valor: 'a_veces', etiqueta: 'Cambian a veces', positiva: false },
      { valor: 'frecuentemente', etiqueta: 'Cambian frecuentemente', positiva: false },
    ],
  },
  {
    id: 'castigo_fisico',
    texto: '¿Ha usado el castigo físico —nalgadas, golpes— como forma de disciplina?',
    avisoPrevio: 'Esta última pregunta es delicada — formúlela con calma, sin juicio, y solo si el contexto de la conversación lo permite.',
    tipo: 'frecuencia',
    opciones: [
      { valor: 'nunca', etiqueta: 'Nunca', positiva: true },
      { valor: 'a_veces', etiqueta: 'A veces', positiva: false },
      { valor: 'frecuentemente', etiqueta: 'Frecuentemente', positiva: false },
      { valor: 'siempre', etiqueta: 'Siempre', positiva: false },
    ],
  },
];

const NOMBRE_PREGUNTA = {
  involucramiento: 'Involucramiento positivo',
  supervision: 'Supervisión/monitoreo',
  disciplina: 'Disciplina',
  consistencia: 'Consistencia',
  castigo_fisico: 'Castigo físico',
};

// La opción elegida ya trae `positiva` (true/false) — se busca en las
// opciones de la pregunta porque `categorias[id]` solo guarda valor y
// etiqueta, no el resto de metadatos de la opción.
function esPositiva(preguntaId, categoria) {
  const pregunta = PREGUNTAS.find((p) => p.id === preguntaId);
  const opcion = pregunta.opciones.find((o) => o.valor === categoria.valor);
  return !!opcion?.positiva;
}

function reglaConsolidada({ categorias }) {
  const claves = Object.keys(categorias);
  if (!claves.every((k) => esPositiva(k, categorias[k]))) return null;
  return {
    codigo: 'CRIANZA_CONSOLIDADA',
    nivel: 'fortaleza',
    titulo: 'Crianza positiva consolidada',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Las 5 dimensiones evaluadas muestran un patrón de crianza consistente y sin uso de castigo físico.',
    preguntas: ['¿Qué prácticas familiares reconoce detrás de este resultado?'],
    estrategias: ['Reconocer explícitamente estas prácticas como una fortaleza a mantener.'],
  };
}

function reglaSupervisionSinInvolucramiento({ categorias }) {
  if (!esPositiva('supervision', categorias.supervision)) return null;
  if (esPositiva('involucramiento', categorias.involucramiento)) return null;
  return {
    codigo: 'CRIANZA_SUPERVISION_SIN_INVOLUCRAMIENTO',
    nivel: 'oportunidad',
    titulo: 'Supervisión sin involucramiento',
    evidencia: [`Supervisión: ${categorias.supervision.etiqueta}`, `Involucramiento positivo: ${categorias.involucramiento.etiqueta}`],
    lectura: 'Hay control/monitoreo de los hijos/as sin que se reporte el mismo nivel de conexión afectiva cotidiana — matiz relevante que ninguna de las dos preguntas muestra por separado.',
    preguntas: ['¿Qué actividades agradables podrían compartir en el día a día?'],
  };
}

// Se marca independientemente de cómo puntúen las otras 4 dimensiones —
// no se "compensa" con buen desempeño en las demás.
function reglaAlertaCastigo({ categorias }) {
  if (esPositiva('castigo_fisico', categorias.castigo_fisico)) return null;
  return {
    codigo: 'CRIANZA_ALERTA_CASTIGO',
    nivel: 'profundizacion',
    titulo: 'Alerta de castigo físico',
    evidencia: [`Castigo físico: ${categorias.castigo_fisico.etiqueta}`],
    lectura: 'Se marca como señal a abordar directamente con el equipo psicosocial, independientemente de cómo puntúen las otras 4 dimensiones — no se compensa con buen desempeño en las demás.',
    preguntas: ['¿Qué situaciones suelen llevar a ese tipo de disciplina?', '¿Ha considerado otras formas de poner límites?'],
    estrategias: ['Abordar el tema directamente y sin juicio en el próximo encuentro, explorando alternativas de disciplina.'],
    riesgos: ['El uso de castigo físico es un factor a priorizar en el seguimiento del caso, independientemente del resto del perfil de crianza.'],
  };
}

function reglaAFortalecer({ categorias }) {
  const claves = Object.keys(categorias);
  if (claves.some((k) => esPositiva(k, categorias[k]))) return null;
  return {
    codigo: 'CRIANZA_A_FORTALECER',
    nivel: 'profundizacion',
    titulo: 'Prácticas de crianza a fortalecer',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Ninguna de las 5 dimensiones evaluadas muestra la práctica asociada a crianza positiva.',
    preguntas: ['¿Qué apoyo necesitaría la familia para fortalecer estas prácticas?'],
  };
}

// Exhaustivo: cubre el resto (entre 1 y 4 dimensiones positivas).
function reglaMixta({ categorias }) {
  const claves = Object.keys(categorias);
  const positivas = claves.filter((k) => esPositiva(k, categorias[k]));
  if (positivas.length === 0 || positivas.length === 5) return null;
  return {
    codigo: 'CRIANZA_MIXTA',
    nivel: 'oportunidad',
    titulo: 'Prácticas de crianza con señales mixtas',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Las respuestas combinan prácticas de crianza positiva con otras a fortalecer — vale la pena explorarlo en la conversación, no promediarlo.',
    preguntas: ['¿Cuál de estas dimensiones siente la familia que más necesita fortalecer primero?'],
  };
}

export const PRACTICAS_CRIANZA = {
  id: 'CRIANZA',
  nombre: 'Prácticas de Crianza',
  descripcion: 'Involucramiento positivo, supervisión, disciplina, consistencia y uso de castigo físico. Preguntas de diseño propio en español — no son los ítems del Alabama Parenting Questionnaire.',
  fuente: 'docs/matriz-variables-indicadores.md#e-crianza-y-cuidado',
  preguntas: PREGUNTAS,
  reglas: [reglaConsolidada, reglaSupervisionSinInvolucramiento, reglaAlertaCastigo, reglaAFortalecer, reglaMixta],
};
