// Intereses vocacionales tipológico — híbrido inspirado en el modelo
// RIASEC de Holland, esfera B. Intereses y Potencial.
//
// Por qué es híbrido: el Self-Directed Search oficial es comercial (PAR
// Inc.). La estructura de 6 tipos de Holland es de dominio académico
// público — lo restringido es el instrumento de medición. Esta versión no
// reproduce sus ítems ni genera un código de 3 letras comparativo/validado.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#b-intereses-y-potencial.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Intereses vocacionales tipológico.

const PRESENCIA = [
  { valor: 'no', etiqueta: 'No', nivel: 'bajo' },
  { valor: 'si', etiqueta: 'Sí', nivel: 'alto' },
];

const PREGUNTAS = [
  { id: 'realista', texto: '¿Disfruta trabajar con las manos, herramientas o al aire libre?', tipo: 'presencia', opciones: PRESENCIA },
  { id: 'investigador', texto: '¿Le gusta observar, analizar o resolver problemas complejos?', tipo: 'presencia', opciones: PRESENCIA },
  { id: 'artistico', texto: '¿Disfruta crear, expresarse o inventar cosas nuevas?', tipo: 'presencia', opciones: PRESENCIA },
  { id: 'social', texto: '¿Prefiere actividades donde ayuda, enseña o cuida a otras personas?', tipo: 'presencia', opciones: PRESENCIA },
  { id: 'emprendedor', texto: '¿Le atrae liderar, persuadir o iniciar proyectos?', tipo: 'presencia', opciones: PRESENCIA },
  { id: 'convencional', texto: '¿Se siente cómodo/a con tareas organizadas o con reglas claras?', tipo: 'presencia', opciones: PRESENCIA },
];

const NOMBRE_TIPO = {
  realista: 'Realista',
  investigador: 'Investigador',
  artistico: 'Artístico',
  social: 'Social',
  emprendedor: 'Emprendedor',
  convencional: 'Convencional',
};

function reglaPerfilCombinado({ categorias }) {
  const claves = Object.keys(categorias);
  const afines = claves.filter((k) => categorias[k].nivel === 'alto');
  if (afines.length < 2 || afines.length > 3) return null;
  return {
    codigo: 'RIASEC_PERFIL_COMBINADO',
    nivel: 'oportunidad',
    titulo: `Perfil combinado: ${afines.map((k) => NOMBRE_TIPO[k]).join(' + ')}`,
    evidencia: afines.map((k) => NOMBRE_TIPO[k]),
    lectura: 'Combinación de afinidades descriptivas — se presenta como perfil descriptivo, explícitamente distinto del código de 3 letras del SDS oficial, que este proyecto no reproduce.',
    preguntas: [`¿Qué actividades concretas conectan estos intereses (${afines.map((k) => NOMBRE_TIPO[k]).join(', ')})?`],
  };
}

function reglaAfinidadAmplia({ categorias }) {
  const claves = Object.keys(categorias);
  const afines = claves.filter((k) => categorias[k].nivel === 'alto');
  if (afines.length < 4) return null;
  return {
    codigo: 'RIASEC_AFINIDAD_AMPLIA',
    nivel: 'oportunidad',
    titulo: 'Afinidad con muchos tipos de interés',
    evidencia: afines.map((k) => NOMBRE_TIPO[k]),
    lectura: 'La persona identifica afinidad con varios tipos de interés a la vez — puede reflejar versatilidad o la necesidad de explorar más a fondo cuál es más significativo.',
    preguntas: ['De todos estos, ¿cuál sentiría que le representa más si tuviera que elegir uno o dos?'],
  };
}

function reglaUnicaAfinidad({ categorias }) {
  const claves = Object.keys(categorias);
  const afines = claves.filter((k) => categorias[k].nivel === 'alto');
  if (afines.length !== 1) return null;
  return {
    codigo: 'RIASEC_UNICA_AFINIDAD',
    nivel: 'oportunidad',
    titulo: `Afinidad clara con el tipo ${NOMBRE_TIPO[afines[0]]}`,
    evidencia: [NOMBRE_TIPO[afines[0]]],
    lectura: 'Se identifica una única afinidad clara entre los 6 tipos explorados.',
    preguntas: [`¿Qué actividades relacionadas con "${NOMBRE_TIPO[afines[0]]}" le gustaría explorar más?`],
  };
}

function reglaSinAfinidad({ categorias }) {
  const claves = Object.keys(categorias);
  if (claves.some((k) => categorias[k].nivel === 'alto')) return null;
  return {
    codigo: 'RIASEC_SIN_AFINIDAD',
    nivel: 'profundizacion',
    titulo: 'Sin afinidad identificada',
    evidencia: ['Los 6 tipos en "No"'],
    lectura: 'Señal de que las preguntas cerradas no capturaron el interés — se recomienda complementar con la categoría abierta "Intereses y preferencias vitales" (también en esfera B) en vez de asumir ausencia de interés.',
    preguntas: ['¿Qué actividades disfruta hacer, aunque no encajen claramente en ninguna de estas categorías?'],
  };
}

export const INTERESES_TIPOLOGICOS = {
  id: 'RIASECHIB',
  nombre: 'Intereses Vocacionales (Tipológico)',
  descripcion: 'Afinidad descriptiva con los 6 tipos de interés de Holland. Preguntas de diseño propio — no reproduce el Self-Directed Search oficial ni genera un código de 3 letras validado.',
  fuente: 'docs/matriz-variables-indicadores.md#b-intereses-y-potencial',
  preguntas: PREGUNTAS,
  reglas: [reglaSinAfinidad, reglaUnicaAfinidad, reglaPerfilCombinado, reglaAfinidadAmplia],
};
