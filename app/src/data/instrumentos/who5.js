// Definición del WHO-5 para el motor genérico (lib/motorInstrumento.js).
//
// Fuente de los 5 ítems y la fórmula: docs/catalogo-instrumentos-psicosociales.md
// (WHO-5 es de acceso abierto desde 2024, cuestionario completo en español
// verificado en la carpeta instrumentos/). Fuente de las reglas de
// interacción: docs/reglas-puntuacion-interpretacion.md, sección WHO-5.

const ITEMS = [
  { id: 'animo', texto: 'Me he sentido alegre y de buen humor' },
  { id: 'calma', texto: 'Me he sentido tranquilo/a y relajado/a' },
  { id: 'energia', texto: 'Me he sentido activo/a y con energía' },
  { id: 'descanso', texto: 'Me he despertado sintiéndome fresco/a y descansado/a' },
  { id: 'interes', texto: 'Mi día a día ha estado lleno de cosas que me interesan' },
];

const OPCIONES = [
  { valor: 5, etiqueta: 'Todo el tiempo' },
  { valor: 4, etiqueta: 'La mayor parte del tiempo' },
  { valor: 3, etiqueta: 'Más de la mitad del tiempo' },
  { valor: 2, etiqueta: 'Menos de la mitad del tiempo' },
  { valor: 1, etiqueta: 'Algunas veces' },
  { valor: 0, etiqueta: 'En ningún momento' },
];

// Regla oficial del propio manual del WHO-5 (no es un corte inventado por
// el equipo): puntaje bruto <13/25 sugiere valorar un screening adicional.
function reglaCorteOficial({ puntaje }) {
  const bruto = puntaje / 4;
  if (bruto >= 13) return null;
  return {
    codigo: 'WHO5_BIENESTAR_BAJO',
    nivel: 'profundizacion',
    titulo: 'Bienestar bajo (regla oficial del instrumento)',
    evidencia: [`Puntaje bruto ${bruto.toFixed(1)}/25 (equivalente a ${puntaje.toFixed(0)}/100)`],
    lectura: 'El propio manual del WHO-5 sugiere valorar la pertinencia de un screening adicional de depresión (ICD-10) cuando el puntaje bruto es menor a 13. Es una señal para el equipo profesional, no una conclusión ni un diagnóstico.',
    preguntas: ['¿Cómo describiría su estado de ánimo en general en las últimas dos semanas?'],
    oportunidad: 'Conversar con el equipo profesional si conviene explorar esto con mayor profundidad.',
    estrategias: [
      'Conversar directamente con la persona sobre cómo se ha sentido, sin partir del puntaje como conclusión.',
      'Revisar si hay eventos recientes del curso de vida (ruptura de pareja, ausencia de un cuidador, fallecimiento, desempleo, enfermedad, hechos de inseguridad) que puedan explicar este resultado — son justamente los eventos que prioriza el servicio.',
      'Si el equipo lo considera pertinente, coordinar con el área de salud o el protocolo de remisión del servicio antes de continuar el acompañamiento.',
    ],
    riesgos: [
      'El propio manual del WHO-5 sugiere valorar un screening adicional de depresión — esto debe tratarse como señal para priorizar el seguimiento del caso, no como una conclusión ni un diagnóstico a comunicar a la persona.',
    ],
  };
}

// Patrón de interacción: si el total no enciende la alerta oficial pero un
// ítem puntúa notablemente más bajo que el resto, igual vale la pena
// explorarlo — es el matiz que el puntaje total por sí solo no muestra.
function reglaAreaEspecifica({ puntaje, respuestas, items }) {
  const bruto = puntaje / 4;
  if (bruto < 13) return null; // ya cubierto por reglaCorteOficial
  const valores = items.map((it) => ({ ...it, valor: respuestas[it.id] }));
  const promedio = valores.reduce((s, v) => s + v.valor, 0) / valores.length;
  const bajos = valores.filter((v) => promedio - v.valor >= 2);
  if (bajos.length === 0) return null;
  return {
    codigo: 'WHO5_AREA_ESPECIFICA',
    nivel: 'oportunidad',
    titulo: 'Área específica de menor bienestar',
    evidencia: bajos.map((v) => `"${v.texto}" puntuó notablemente más bajo que el resto de dimensiones`),
    lectura: 'El bienestar general no enciende la alerta oficial del instrumento, pero hay una dimensión específica que vale la pena explorar aunque el puntaje total no lo refleje.',
    preguntas: bajos.map((v) => `¿Qué ha influido en cómo se ha sentido respecto a "${v.texto.toLowerCase()}" en las últimas dos semanas?`),
    oportunidad: 'Profundizar en esta dimensión específica en la conversación con la persona.',
    estrategias: [
      'Profundizar específicamente en la dimensión señalada durante el próximo encuentro (Diálogos para el Cuidado y el Buen Vivir).',
      'Registrar este hallazgo para comparar en una próxima aplicación del WHO-5 (perfil dinámico T0/T1).',
    ],
  };
}

function reglaConsistente({ puntaje, respuestas, items }) {
  const bruto = puntaje / 4;
  if (bruto < 13) return null;
  const valores = items.map((it) => respuestas[it.id]);
  const promedio = valores.reduce((s, v) => s + v, 0) / valores.length;
  const hayBajo = valores.some((v) => promedio - v >= 2);
  if (hayBajo) return null;
  return {
    codigo: 'WHO5_CONSISTENTE',
    nivel: 'fortaleza',
    titulo: 'Bienestar consistente',
    evidencia: [`Puntaje total ${puntaje.toFixed(0)}/100`],
    lectura: 'No se identifican áreas específicas de menor bienestar dentro de las últimas 2 semanas: las 5 dimensiones se perciben en niveles similares.',
    preguntas: ['¿Qué cree que ha contribuido a este bienestar percibido en las últimas semanas?'],
    estrategias: [
      'Reconocer explícitamente con la persona los factores que sostienen este bienestar.',
      'Usar este resultado como línea base (T0) para comparar en futuras aplicaciones.',
    ],
  };
}

export const WHO5 = {
  id: 'WHO5',
  nombre: 'Índice de Bienestar OMS (WHO-5)',
  descripcion: 'Mide el bienestar subjetivo de las últimas 2 semanas. Es un instrumento de screening, no una herramienta diagnóstica.',
  fuente: 'docs/catalogo-instrumentos-psicosociales.md#who-5--índice-de-bienestar-oms',
  items: ITEMS,
  opciones: OPCIONES,
  formula: 'suma',
  multiplicador: 4,
  reglas: [reglaCorteOficial, reglaAreaEspecifica, reglaConsistente],
};
