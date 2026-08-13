// BFI-2 — Big Five Inventory-2, versión en español (John & Soto, 2017;
// traducción Gallardo-Pujol, Oceja, Cortijos-Bernabeu y Rouco), esfera A.
// Persona.
//
// Instrumento real, no híbrido: los 60 ítems y la clave de corrección se
// extrajeron directamente con pdftotext de instrumentos/BFI2_Spanish.pdf.
// Licencia explícitamente "código abierto" según el propio documento — "no
// hay costes asociados al uso del BFI-2 en su versión española" — el
// instrumento con la licencia más clara de todo el catálogo (ver
// docs/catalogo-instrumentos-psicosociales.md#bfi-2--big-five-inventory-2-versión-en-español).
//
// Alcance: se puntúa a nivel de los 5 dominios (Extraversión, Cordialidad,
// Responsabilidad, Emocionalidad negativa, Apertura de mente), no de las 15
// facetas — las facetas añaden granularidad que este módulo descriptivo no
// necesita todavía; quedan documentadas abajo por si se requieren después.
// Escala Likert 1-5, ítems inversos marcados "R" en la clave original.

const OPCIONES = [
  { valor: 1, etiqueta: 'Muy en desacuerdo' },
  { valor: 2, etiqueta: 'Algo en desacuerdo' },
  { valor: 3, etiqueta: 'Neutral, sin opinión' },
  { valor: 4, etiqueta: 'Algo de acuerdo' },
  { valor: 5, etiqueta: 'Muy de acuerdo' },
];

const TEXTO_ITEM = {
  1: 'Abierto/a, sociable',
  2: 'Compasivo/a, con un gran corazón',
  3: 'Que tiende a ser desorganizado/a',
  4: 'Relajado/a, que gestiona bien el estrés',
  5: 'Con pocos intereses artísticos',
  6: 'Con una personalidad asertiva',
  7: 'Respetuoso/a, que trata a los demás con respeto',
  8: 'Que tiende a ser perezoso/a',
  9: 'Que se mantiene optimista después de sufrir un contratiempo',
  10: 'Que siente curiosidad por gran variedad de cosas',
  11: 'Que raramente se siente emocionado/a o entusiasmado/a',
  12: 'Que tiende a buscar los defectos de los demás',
  13: 'Formal, constante',
  14: 'Variable, con notables cambios de humor',
  15: 'Ingenioso/a, que busca formas inteligentes de hacer las cosas',
  16: 'Que tiende a estar callado/a',
  17: 'Que siente poca compasión hacia los demás',
  18: 'Metódico/a, a quien le gusta mantenerlo todo en orden',
  19: 'Que puede ponerse tenso/a',
  20: 'Fascinado por el arte, la música o la literatura',
  21: 'Dominante, que actúa como líder',
  22: 'Que empieza discusiones con los demás',
  23: 'A quien le cuesta empezar las tareas',
  24: 'Que se siente seguro/a, cómodo/a consigo mismo/a',
  25: 'Que evita conversaciones intelectuales y filosóficas',
  26: 'Menos activo/a que otras personas',
  27: 'Comprensivo/a con los demás',
  28: 'Que puede ser algo descuidado/a',
  29: 'Emocionalmente estable, que no se altera con facilidad',
  30: 'Con poca creatividad',
  31: 'A veces tímido/a, introvertido/a',
  32: 'Servicial y generoso/a con los demás',
  33: 'Que mantiene todo limpio y ordenado',
  34: 'Que se preocupa mucho',
  35: 'Que valora el arte y la belleza',
  36: 'A quien le es difícil influir en los demás',
  37: 'Que a veces es grosero/a con los demás',
  38: 'Eficiente, que consigue que las cosas se hagan',
  39: 'Que a menudo se siente triste',
  40: 'Complejo/a, de pensamientos profundos',
  41: 'Lleno/a de energía',
  42: 'Que desconfía de las intenciones de los demás',
  43: 'Fiable, con el/la que siempre se puede contar',
  44: 'Que controla sus emociones',
  45: 'Que tiene dificultad para imaginarse las cosas',
  46: 'Hablador/a',
  47: 'Que puede ser frío/a e insensible',
  48: 'Que lo deja todo hecho un lío, que no limpia',
  49: 'Que raramente se siente ansioso/a o miedoso/a',
  50: 'Que considera que la poesía y el teatro son aburridos',
  51: 'Que prefiere que otros asuman la responsabilidad',
  52: 'Educado/a, cortés con los demás',
  53: 'Tenaz, que trabaja hasta terminar la tarea',
  54: 'Que tiende a sentirse deprimido/a, melancólico/a',
  55: 'Con poco interés por ideas abstractas',
  56: 'Que muestra mucho entusiasmo',
  57: 'Que piensa bien de la gente',
  58: 'Que a veces se comporta de manera irresponsable',
  59: 'Temperamental, que se exalta fácilmente',
  60: 'Original, que aporta ideas nuevas',
};

// Clave de corrección original (dominios), ítems inversos marcados "R".
function items(spec) {
  return spec.map((n) => {
    const invertido = typeof n === 'string' && n.endsWith('R');
    const num = invertido ? Number(n.slice(0, -1)) : n;
    return { id: `bfi_${num}`, texto: TEXTO_ITEM[num], invertido };
  });
}

const ITEMS_EXTRAVERSION = items([1, 6, '11R', '16R', 21, '26R', '31R', '36R', 41, 46, '51R', 56]);
const ITEMS_CORDIALIDAD = items([2, 7, '12R', '17R', '22R', 27, 32, '37R', '42R', '47R', 52, 57]);
const ITEMS_RESPONSABILIDAD = items(['3R', '8R', 13, 18, '23R', '28R', 33, 38, 43, '48R', 53, '58R']);
const ITEMS_EMOCIONALIDAD_NEGATIVA = items(['4R', '9R', 14, 19, '24R', '29R', 34, 39, '44R', '49R', 54, 59]);
const ITEMS_APERTURA = items(['5R', 10, 15, 20, '25R', '30R', 35, 40, '45R', '50R', '55R', 60]);

const NOMBRE_DOMINIO = {
  extraversion: 'Extraversión',
  cordialidad: 'Cordialidad',
  responsabilidad: 'Responsabilidad',
  emocionalidad_negativa: 'Emocionalidad negativa',
  apertura: 'Apertura de mente',
};

function nivel(media) {
  if (media <= 2.3) return 'bajo';
  if (media >= 3.7) return 'alto';
  return 'medio';
}

function reglaResilienteSociable({ puntajes }) {
  if (nivel(puntajes.extraversion) !== 'alto') return null;
  if (nivel(puntajes.emocionalidad_negativa) !== 'bajo') return null;
  return {
    codigo: 'BFI2_RESILIENTE_SOCIABLE',
    nivel: 'fortaleza',
    titulo: 'Perfil resiliente y sociable',
    evidencia: [`Extraversión: ${puntajes.extraversion.toFixed(1)}/5`, `Emocionalidad negativa: ${puntajes.emocionalidad_negativa.toFixed(1)}/5`],
    lectura: 'Se combina una alta disposición a la interacción social con baja tendencia a la ansiedad o el desánimo — un recurso personal directo frente a situaciones de crisis o cambio.',
    preguntas: ['¿En qué situaciones recientes ha usado esta combinación de energía social y estabilidad emocional?'],
    estrategias: ['Reconocer explícitamente este recurso como una fortaleza sobre la que apoyar el acompañamiento.'],
  };
}

function reglaResponsableCordial({ puntajes }) {
  if (nivel(puntajes.responsabilidad) !== 'alto') return null;
  if (nivel(puntajes.cordialidad) !== 'alto') return null;
  return {
    codigo: 'BFI2_RESPONSABLE_CORDIAL',
    nivel: 'fortaleza',
    titulo: 'Perfil confiable y prosocial',
    evidencia: [`Responsabilidad: ${puntajes.responsabilidad.toFixed(1)}/5`, `Cordialidad: ${puntajes.cordialidad.toFixed(1)}/5`],
    lectura: 'La persona se percibe a sí misma como organizada y constante, además de comprensiva y generosa con los demás — combinación relevante para el objetivo de cuidado mutuo.',
    preguntas: ['¿Cómo se traduce esto en su relación con su familia o su entorno cercano?'],
  };
}

function reglaVulnerabilidadEmocional({ puntajes }) {
  if (nivel(puntajes.emocionalidad_negativa) !== 'alto') return null;
  if (nivel(puntajes.responsabilidad) !== 'bajo') return null;
  return {
    codigo: 'BFI2_VULNERABILIDAD_EMOCIONAL',
    nivel: 'profundizacion',
    titulo: 'Alta emocionalidad negativa con baja organización percibida',
    evidencia: [`Emocionalidad negativa: ${puntajes.emocionalidad_negativa.toFixed(1)}/5`, `Responsabilidad: ${puntajes.responsabilidad.toFixed(1)}/5`],
    lectura: 'Una alta tendencia a la ansiedad, tristeza o inestabilidad emocional, combinada con baja percepción de organización propia, puede dificultar sostener rutinas o planes durante una crisis — hipótesis a conversar, no una conclusión clínica.',
    preguntas: ['¿Qué le ayuda a organizarse cuando se siente así de desbordado/a?'],
    estrategias: ['Explorar con la persona estrategias concretas de manejo del estrés y apoyos externos, sin asumir capacidad de organización autónoma.'],
    riesgos: ['Esta combinación es un factor a priorizar en el seguimiento del caso, especialmente en contextos de crisis familiar.'],
  };
}

function reglaAperturaAlta({ puntajes }) {
  if (nivel(puntajes.apertura) !== 'alto') return null;
  return {
    codigo: 'BFI2_APERTURA_ALTA',
    nivel: 'oportunidad',
    titulo: 'Apertura a nuevas experiencias e ideas',
    evidencia: [`Apertura de mente: ${puntajes.apertura.toFixed(1)}/5`],
    lectura: 'La persona se percibe curiosa e interesada en ideas, arte o formas nuevas de resolver situaciones — recurso a considerar al proponer alternativas o rutas de acción en el acompañamiento.',
    preguntas: ['¿Qué tipo de ideas o actividades nuevas le interesaría explorar?'],
  };
}

// Catch-all exhaustivo: si ninguna de las 4 reglas anteriores aplicó, se usa
// como `reglaResumen` (ver motorInstrumento.js) en vez de forzar un patrón
// "mixto" con juicio de valor — los 5 dominios tienen valencias distintas
// (Emocionalidad negativa alta no es lo opuesto de una fortaleza de la
// misma forma que Apertura baja), así que el resumen solo presenta los
// puntajes, sin etiquetar ninguno como positivo o negativo.
function reglaResumen({ puntajes }) {
  return {
    codigo: 'BFI2_PERFIL_GENERAL',
    nivel: 'oportunidad',
    titulo: 'Perfil de personalidad (Cinco Grandes)',
    evidencia: Object.entries(NOMBRE_DOMINIO).map(([id, nombre]) => `${nombre}: ${puntajes[id].toFixed(1)}/5`),
    lectura: 'El perfil no encaja en ninguno de los patrones específicos definidos — los 5 puntajes quedan disponibles para conversar con la persona; ningún dominio es "bueno" o "malo" por sí mismo.',
    preguntas: ['¿Qué de este perfil siente que lo/la describe bien, y qué no tanto?'],
  };
}

export const BFI2 = {
  id: 'BFI2',
  nombre: 'Rasgos de Personalidad (BFI-2)',
  descripcion: 'Cinco Grandes: Extraversión, Cordialidad, Responsabilidad, Emocionalidad negativa, Apertura de mente. Versión española completa del Big Five Inventory-2 (John & Soto, 2017), licencia de código abierto.',
  fuente: 'docs/catalogo-instrumentos-psicosociales.md#bfi-2--big-five-inventory-2-versión-en-español',
  formula: 'promedio',
  escalaMin: 1,
  escalaMax: 5,
  opciones: OPCIONES,
  subescalas: [
    { id: 'extraversion', nombre: 'Extraversión', items: ITEMS_EXTRAVERSION },
    { id: 'cordialidad', nombre: 'Cordialidad', items: ITEMS_CORDIALIDAD },
    { id: 'responsabilidad', nombre: 'Responsabilidad', items: ITEMS_RESPONSABILIDAD },
    { id: 'emocionalidad_negativa', nombre: 'Emocionalidad negativa', items: ITEMS_EMOCIONALIDAD_NEGATIVA },
    { id: 'apertura', nombre: 'Apertura de mente', items: ITEMS_APERTURA },
  ],
  reglas: [reglaResilienteSociable, reglaResponsableCordial, reglaVulnerabilidadEmocional, reglaAperturaAlta],
  reglaResumen,
};
