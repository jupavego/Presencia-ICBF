// Aptitudes y habilidades percibidas — diseño propio del equipo, esfera B.
// Intereses y Potencial. Explora dominios de habilidad (manuales, de
// comunicación, organización, etc.), distinto de las fortalezas de
// carácter (Fortalezas por virtud, sobre rasgos como valentía u
// honestidad) y de las 3 preguntas de "Aptitudes" en Proyecto de Vida
// (esfera M), que son de presencia pura sin categorizar el área.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#b-intereses-y-potencial.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Aptitudes y habilidades percibidas.

const PREGUNTAS = [
  {
    id: 'areas',
    texto: '¿En cuáles de estas áreas de habilidad se reconoce más capaz?',
    tipo: 'checklist',
    opciones: [
      { valor: 'manuales', etiqueta: 'Manuales/técnicas' },
      { valor: 'comunicacion', etiqueta: 'Comunicación/relación con otras personas' },
      { valor: 'organizacion', etiqueta: 'Organización/planeación' },
      { valor: 'cuidado', etiqueta: 'Cuidado de otras personas' },
      { valor: 'creativas', etiqueta: 'Creativas/artísticas' },
      { valor: 'liderazgo', etiqueta: 'Liderazgo/coordinación' },
      { valor: 'digitales', etiqueta: 'Digitales/tecnológicas' },
      { valor: 'ninguna', etiqueta: 'Ninguna identificada en este momento' },
    ],
    notaAbierta: true,
    notaPlaceholder: 'Detalle de lo marcado',
  },
  {
    id: 'origen',
    texto: '¿Esas habilidades las ha desarrollado principalmente por experiencia propia, formación formal, o ambas?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'experiencia', etiqueta: 'Experiencia propia' },
      { valor: 'formacion', etiqueta: 'Formación formal' },
      { valor: 'ambas', etiqueta: 'Ambas' },
      { valor: 'no_sabe', etiqueta: 'No sabría decir' },
    ],
  },
  {
    id: 'reconocimiento',
    texto: '¿Su entorno —familia, amigos, comunidad— le reconoce alguna de estas habilidades?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No' },
      { valor: 'si', etiqueta: 'Sí' },
    ],
    notaAbierta: true,
    notaPlaceholder: '¿Cuáles le reconocen?',
  },
  {
    id: 'uso_en_dificultades',
    texto: '¿Ha podido usar estas habilidades para resolver situaciones difíciles?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No' },
      { valor: 'parcial', etiqueta: 'Parcialmente' },
      { valor: 'si', etiqueta: 'Sí' },
    ],
  },
];

function hayAptitudes(categoriaAreas) {
  return categoriaAreas.some((c) => c.valor !== 'ninguna');
}

function reglaSinAptitudes({ categorias }) {
  if (hayAptitudes(categorias.areas)) return null;
  return {
    codigo: 'APTITUD_SIN_IDENTIFICAR',
    nivel: 'profundizacion',
    titulo: 'Sin habilidades identificadas en esta exploración',
    evidencia: ['Ninguna de las áreas propuestas fue marcada'],
    lectura: 'No se debe asumir ausencia real de habilidades — es más probable que las categorías propuestas no hayan logrado capturarlas; señal para profundizar en conversación abierta.',
    preguntas: ['¿Qué le han dicho otras personas que se le da bien?'],
  };
}

function reglaFuncionalesReconocidas({ categorias }) {
  if (!hayAptitudes(categorias.areas)) return null;
  if (categorias.reconocimiento.valor !== 'si') return null;
  if (categorias.uso_en_dificultades.valor !== 'si') return null;
  const areas = categorias.areas.filter((c) => c.valor !== 'ninguna').map((c) => c.etiqueta);
  return {
    codigo: 'APTITUD_FUNCIONALES_RECONOCIDAS',
    nivel: 'fortaleza',
    titulo: 'Habilidades funcionales y reconocidas',
    evidencia: [`Áreas: ${areas.join(', ')}`, 'Reconocidas por el entorno: Sí', 'Usadas para resolver dificultades: Sí'],
    lectura: 'Las habilidades identificadas no solo son percibidas por la persona: también son reconocidas por su entorno y ya han sido útiles en situaciones difíciles — recurso directo y verificado en la práctica.',
    preguntas: ['¿Cómo podría usar más estas habilidades en su situación actual?'],
    estrategias: ['Reconocer explícitamente estas habilidades como un recurso ya probado, no solo potencial.'],
  };
}

function reglaSinReconocimientoExterno({ categorias }) {
  if (!hayAptitudes(categorias.areas)) return null;
  if (categorias.reconocimiento.valor !== 'no') return null;
  const areas = categorias.areas.filter((c) => c.valor !== 'ninguna').map((c) => c.etiqueta);
  return {
    codigo: 'APTITUD_SIN_RECONOCIMIENTO',
    nivel: 'oportunidad',
    titulo: 'Habilidades propias sin reconocimiento externo',
    evidencia: [`Áreas: ${areas.join(', ')}`, 'Reconocidas por el entorno: No'],
    lectura: 'La persona reconoce estas habilidades en sí misma, pero no percibe que su entorno se las reconozca — vale la pena explorar si es una diferencia real de percepción o si el entorno simplemente no ha tenido oportunidad de verlas.',
    preguntas: ['¿En qué situaciones podría mostrar estas habilidades para que otros las reconozcan también?'],
  };
}

// Exhaustivo: cubre el resto (hay aptitudes, reconocidas por el entorno,
// pero no usadas —o solo parcialmente— para resolver dificultades).
function reglaReconocidasSinUso({ categorias }) {
  if (!hayAptitudes(categorias.areas)) return null;
  if (categorias.reconocimiento.valor !== 'si') return null;
  if (categorias.uso_en_dificultades.valor === 'si') return null;
  const areas = categorias.areas.filter((c) => c.valor !== 'ninguna').map((c) => c.etiqueta);
  return {
    codigo: 'APTITUD_RECONOCIDAS_SIN_USO',
    nivel: 'oportunidad',
    titulo: 'Habilidades reconocidas, sin uso claro ante dificultades',
    evidencia: [`Áreas: ${areas.join(', ')}`, 'Reconocidas por el entorno: Sí', `Usadas para resolver dificultades: ${categorias.uso_en_dificultades.etiqueta}`],
    lectura: 'El entorno reconoce estas habilidades, pero la persona no las ha usado —o solo parcialmente— frente a situaciones difíciles; puede ser una capacidad disponible que todavía no se ha puesto a prueba en ese sentido.',
    preguntas: ['¿Qué haría falta para poner estas habilidades al servicio de una dificultad actual?'],
  };
}

export const APTITUDES_HABILIDADES = {
  id: 'APTITUD',
  nombre: 'Aptitudes y Habilidades Percibidas',
  descripcion: 'Dominios de habilidad que la persona reconoce en sí misma, si su entorno se las reconoce y si las ha usado frente a dificultades. Categoría de exploración de diseño propio del equipo.',
  fuente: 'docs/matriz-variables-indicadores.md#b-intereses-y-potencial',
  preguntas: PREGUNTAS,
  reglas: [reglaSinAptitudes, reglaFuncionalesReconocidas, reglaSinReconocimientoExterno, reglaReconocidasSinUso],
};
