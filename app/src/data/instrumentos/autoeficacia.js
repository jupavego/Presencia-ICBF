// Escala de Autoeficacia General — Baessler & Schwarzer (1996), adaptación
// española de Sanjuán, Pérez García & Bermúdez (2000).
//
// Fuente de los 10 ítems: Tabla I del paper (instrumentos/SANJUAN-PEREZ-BERMUDEZ_
// Psicothema-2000_AdaptacinescalaAutoeficaciaGeneral.pdf), extraída
// directamente con pdftotext. La adaptación española cambió el formato de
// respuesta del original (Likert de 4) a una escala de 10 puntos, confirmado
// en el texto ("las puntuaciones de los sujetos podían oscilar de 10 a
// 100"). El paper no detalla el texto exacto de las 10 etiquetas de la
// escala de respuesta — se usa el anclaje estándar de acuerdo/desacuerdo en
// los extremos (1 y 10), consistente con que todos los ítems son
// afirmaciones a las que se responde por nivel de acuerdo.
//
// Sin puntos de corte oficiales (confirmado en el catálogo) — el nivel por
// tercios es un corte descriptivo propio del equipo. Reglas de interacción:
// docs/reglas-puntuacion-interpretacion.md, sección Autoeficacia General.

const ITEMS = [
  { id: 'item1', texto: 'Puedo encontrar la forma de obtener lo que quiero aunque alguien se me oponga.' },
  { id: 'item2', texto: 'Puedo resolver problemas difíciles si me esfuerzo lo suficiente.' },
  { id: 'item3', texto: 'Me es fácil persistir en lo que me he propuesto hasta llegar a alcanzar mis metas.' },
  { id: 'item4', texto: 'Tengo confianza en que podría manejar eficazmente acontecimientos inesperados.' },
  { id: 'item5', texto: 'Gracias a mis cualidades y recursos puedo superar situaciones imprevistas.' },
  { id: 'item6', texto: 'Cuando me encuentro en dificultades puedo permanecer tranquilo/a porque cuento con las habilidades necesarias para manejar situaciones difíciles.' },
  { id: 'item7', texto: 'Venga lo que venga, por lo general soy capaz de manejarlo.' },
  { id: 'item8', texto: 'Puedo resolver la mayoría de los problemas si me esfuerzo lo necesario.' },
  { id: 'item9', texto: 'Si me encuentro en una situación difícil, generalmente se me ocurre qué debo hacer.' },
  { id: 'item10', texto: 'Al tener que hacer frente a un problema, generalmente se me ocurren varias alternativas de cómo resolverlo.' },
];

const OPCIONES = Array.from({ length: 10 }, (_, i) => ({ valor: i + 1, etiqueta: String(i + 1) }));

function reglaNivel({ puntaje }) {
  if (puntaje <= 40) {
    return {
      codigo: 'AUTOEF_BAJA',
      nivel: 'profundizacion',
      titulo: 'Autoeficacia percibida baja',
      evidencia: [`Puntaje total ${puntaje.toFixed(0)}/100`],
      lectura: 'La persona percibe menor confianza en su capacidad de manejar situaciones estresantes o inesperadas con sus propios recursos.',
      preguntas: ['¿Hay alguna situación reciente en la que haya logrado resolver algo, aunque fuera pequeño?', '¿Qué le ayudaría a sentirse con más recursos frente a los problemas?'],
      estrategias: [
        'Explorar junto con la persona situaciones recientes donde haya logrado resolver algo, por pequeño que sea, para reconocer recursos ya presentes.',
        'Cruzar esta lectura con las herramientas de Fortalezas de carácter y Resiliencia individual (esfera A/B) para una imagen más completa antes de proponer acciones.',
      ],
      riesgos: ['Una autoeficacia percibida baja puede influir en la disposición de la persona para participar activamente en su propio plan de acompañamiento — vale la pena tenerlo en cuenta al proponer actividades o compromisos, ajustando el ritmo si es necesario.'],
    };
  }
  if (puntaje <= 70) {
    return {
      codigo: 'AUTOEF_MODERADA',
      nivel: 'oportunidad',
      titulo: 'Autoeficacia percibida moderada',
      evidencia: [`Puntaje total ${puntaje.toFixed(0)}/100`],
      lectura: 'La persona percibe una confianza intermedia en su capacidad de manejar situaciones difíciles — ni especialmente baja ni consolidada.',
      preguntas: ['¿En qué tipo de situaciones se siente más seguro/a de su capacidad de resolver? ¿Y en cuáles menos?'],
      estrategias: ['Identificar con la persona en qué áreas específicas de su vida siente más o menos confianza, para orientar el acompañamiento hacia esas diferencias.'],
    };
  }
  return {
    codigo: 'AUTOEF_ALTA',
    nivel: 'fortaleza',
    titulo: 'Autoeficacia percibida alta',
    evidencia: [`Puntaje total ${puntaje.toFixed(0)}/100`],
    lectura: 'La persona percibe una confianza consolidada en su propia capacidad de manejar situaciones difíciles o inesperadas.',
    preguntas: ['¿Qué le ha ayudado a desarrollar esta confianza en sus propios recursos?'],
    estrategias: ['Reconocer explícitamente este recurso con la persona — es una fortaleza sobre la cual apoyar el resto del acompañamiento.'],
  };
}

// Interacción dentro del propio instrumento: un ítem que puntúa muy por
// debajo del promedio, incluso con un total moderado o alto, señala un área
// específica que el puntaje global no muestra por sí solo.
function reglaItemDivergente({ puntaje, respuestas, items }) {
  if (puntaje <= 40) return null; // ya cubierto por la lectura de nivel bajo
  const valores = items.map((it) => ({ ...it, valor: respuestas[it.id] }));
  const promedio = valores.reduce((s, v) => s + v.valor, 0) / valores.length;
  const bajos = valores.filter((v) => promedio - v.valor >= 3);
  if (bajos.length === 0) return null;
  return {
    codigo: 'AUTOEF_ITEM_DIVERGENTE',
    nivel: 'oportunidad',
    titulo: 'Área específica dentro de la autoeficacia general',
    evidencia: bajos.map((v) => `"${v.texto}" puntuó notablemente más bajo que el resto`),
    lectura: 'El puntaje general no lo refleja, pero hay un aspecto específico de la autoeficacia percibida que vale la pena explorar por separado.',
    preguntas: bajos.map((v) => `¿Qué hace más difícil sentirse capaz frente a "${v.texto.toLowerCase()}"?`),
  };
}

export const AUTOEFICACIA = {
  id: 'AUTOEF',
  nombre: 'Autoeficacia General',
  descripcion: 'Confianza percibida para manejar situaciones estresantes o inesperadas con los propios recursos.',
  fuente: 'docs/catalogo-instrumentos-psicosociales.md#escala-de-autoeficacia-general-adaptación-española',
  items: ITEMS,
  opciones: OPCIONES,
  formula: 'suma',
  reglas: [reglaNivel, reglaItemDivergente],
};
