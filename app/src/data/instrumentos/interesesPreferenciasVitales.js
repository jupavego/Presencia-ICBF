// Intereses y preferencias vitales — diseño propio del equipo, esfera B.
// Intereses y Potencial. Exploración cualitativa y abierta, distinta del
// Intereses vocacionales tipológico (RIASEC híbrido, ya construido): en vez
// de 6 tipos fijos de Holland, explora áreas temáticas amplias y qué tanto
// esos intereses están activos hoy en la vida de la persona. También
// distinta de las 3 preguntas de "Intereses" en Proyecto de Vida (esfera
// M), que son de presencia pura (¿tiene o no?) sin categorizar el área.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#b-intereses-y-potencial.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Intereses y preferencias vitales.

const PREGUNTAS = [
  {
    id: 'areas',
    texto: '¿En cuáles de estas áreas identifica mayor interés o disfrute?',
    tipo: 'checklist',
    opciones: [
      { valor: 'naturaleza', etiqueta: 'Naturaleza/aire libre' },
      { valor: 'deporte', etiqueta: 'Deporte/actividad física' },
      { valor: 'arte', etiqueta: 'Arte/creatividad' },
      { valor: 'tecnologia', etiqueta: 'Tecnología' },
      { valor: 'cuidado', etiqueta: 'Cuidado de otros/comunidad' },
      { valor: 'negocios', etiqueta: 'Negocios/emprendimiento' },
      { valor: 'conocimiento', etiqueta: 'Lectura/conocimiento' },
      { valor: 'musica', etiqueta: 'Música' },
      { valor: 'ninguno', etiqueta: 'Ninguno identificado en este momento' },
    ],
    notaAbierta: true,
    notaPlaceholder: 'Detalle de lo marcado',
  },
  {
    id: 'practica',
    texto: '¿Con qué frecuencia dedica tiempo actualmente a estas áreas de interés?',
    tipo: 'frecuencia',
    opciones: [
      { valor: 'nunca', etiqueta: 'Nunca', nivel: 'bajo' },
      { valor: 'a_veces', etiqueta: 'A veces', nivel: 'bajo' },
      { valor: 'frecuentemente', etiqueta: 'Frecuentemente', nivel: 'alto' },
      { valor: 'siempre', etiqueta: 'Siempre', nivel: 'alto' },
    ],
  },
  {
    id: 'comparte',
    texto: '¿Comparte estos intereses con otras personas —familia, amigos, comunidad?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No' },
      { valor: 'si', etiqueta: 'Sí' },
    ],
  },
];

function hayIntereses(categoriaAreas) {
  return categoriaAreas.some((c) => c.valor !== 'ninguno');
}

function reglaSinIntereses({ categorias }) {
  if (hayIntereses(categorias.areas)) return null;
  return {
    codigo: 'INTERES_SIN_IDENTIFICAR',
    nivel: 'profundizacion',
    titulo: 'Sin áreas de interés identificadas en esta exploración',
    evidencia: ['Ninguna de las áreas propuestas fue marcada'],
    lectura: 'No se debe asumir ausencia real de intereses — es más probable que las categorías propuestas no hayan logrado capturarlos; señal para profundizar en conversación abierta.',
    preguntas: ['¿Qué solía disfrutar hacer en otro momento de su vida?'],
  };
}

function reglaActivosCompartidos({ categorias }) {
  if (!hayIntereses(categorias.areas)) return null;
  if (categorias.practica.nivel !== 'alto') return null;
  if (categorias.comparte.valor !== 'si') return null;
  const areas = categorias.areas.filter((c) => c.valor !== 'ninguno').map((c) => c.etiqueta);
  return {
    codigo: 'INTERES_ACTIVOS_COMPARTIDOS',
    nivel: 'fortaleza',
    titulo: 'Intereses activos y compartidos',
    evidencia: [`Áreas: ${areas.join(', ')}`, `Práctica: ${categorias.practica.etiqueta}`, 'Los comparte con otras personas: Sí'],
    lectura: 'Los intereses identificados están activos en la vida cotidiana y además se comparten con otras personas — recurso directo, tanto personal como de red social.',
    preguntas: ['¿Con quién comparte más estos intereses?'],
    estrategias: ['Reconocer estos intereses como un punto de conexión social ya existente, útil para fortalecer redes de apoyo.'],
  };
}

function reglaLatentes({ categorias }) {
  if (!hayIntereses(categorias.areas)) return null;
  if (categorias.practica.nivel !== 'bajo') return null;
  const areas = categorias.areas.filter((c) => c.valor !== 'ninguno').map((c) => c.etiqueta);
  return {
    codigo: 'INTERES_LATENTES',
    nivel: 'oportunidad',
    titulo: 'Intereses identificados pero poco practicados',
    evidencia: [`Áreas: ${areas.join(', ')}`, `Práctica: ${categorias.practica.etiqueta}`],
    lectura: 'Existen intereses reconocidos que hoy no ocupan un espacio activo en la vida de la persona — vale la pena explorar qué los limita.',
    preguntas: ['¿Qué le impide dedicarles más tiempo actualmente?'],
  };
}

// Exhaustivo: cubre el resto (hay intereses, práctica alta, pero no los
// comparte con nadie).
function reglaActivosSinCompartir({ categorias }) {
  if (!hayIntereses(categorias.areas)) return null;
  if (categorias.practica.nivel !== 'alto') return null;
  if (categorias.comparte.valor === 'si') return null;
  const areas = categorias.areas.filter((c) => c.valor !== 'ninguno').map((c) => c.etiqueta);
  return {
    codigo: 'INTERES_ACTIVOS_SIN_COMPARTIR',
    nivel: 'oportunidad',
    titulo: 'Intereses activos, pero individuales',
    evidencia: [`Áreas: ${areas.join(', ')}`, `Práctica: ${categorias.practica.etiqueta}`, 'Los comparte con otras personas: No'],
    lectura: 'Los intereses están activos en la vida cotidiana, pero se viven de forma individual — podrían ser un punto de partida para tejer nuevas conexiones sociales.',
    preguntas: ['¿Le interesaría compartir esto con otras personas si tuviera la oportunidad?'],
  };
}

export const INTERESES_PREFERENCIAS_VITALES = {
  id: 'INTERES',
  nombre: 'Intereses y Preferencias Vitales',
  descripcion: 'Áreas temáticas de interés o disfrute y qué tan activas están en la vida cotidiana. Complementa la versión tipológica (RIASEC) con una mirada más abierta. Categoría de exploración de diseño propio.',
  fuente: 'docs/matriz-variables-indicadores.md#b-intereses-y-potencial',
  preguntas: PREGUNTAS,
  reglas: [reglaSinIntereses, reglaActivosCompartidos, reglaLatentes, reglaActivosSinCompartir],
};
