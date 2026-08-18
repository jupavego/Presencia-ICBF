// McMaster Family Assessment Device (FAD) — Epstein, Baldwin & Bishop (1983).
//
// Fuente de los 60 ítems: instrumentos/McMaster_FAD.pdf, un PDF escaneado
// sin capa de texto — se renderizó a imagen (pdftoppm) y se transcribió
// visualmente cada uno de los 4 páginas, ítem por ítem, verificando contra
// la numeración 1-60 del propio documento. El PDF de texto
// McMaster_FAD_Subscales.pdf que se había usado antes solo listaba 53 de
// los 60 ítems (le faltaban ítems completos de Resolución de Problemas,
// Comunicación y Roles) — no se usó como fuente final por esa razón.
//
// Fuente de la asignación ítem→subescala y de qué ítems son directos/
// inversos: instrumentos/FAD.R (script de puntuación oficial, numeración
// FAD_1 a FAD_60), no inferida de la lectura de los enunciados.
//
// Traducción al español: propia del equipo — no hay validación
// hispanohablante confirmada en la carpeta (ver catálogo). Escala de
// respuesta original: 4 puntos (Muy de acuerdo a Muy en desacuerdo,
// codificados 1-4). En este instrumento, a diferencia de los demás ya
// digitalizados, un puntaje MÁS ALTO indica MÁS dificultad — los ítems
// "inversos" son los redactados en sentido de disfunción.
//
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// McMaster FAD.

const OPCIONES = [
  { valor: 1, etiqueta: 'Muy de acuerdo' },
  { valor: 2, etiqueta: 'De acuerdo' },
  { valor: 3, etiqueta: 'En desacuerdo' },
  { valor: 4, etiqueta: 'Muy en desacuerdo' },
];

// Mismo patrón items(spec)/'R' que ya usan bfi2.js y frasReal.js: cada
// número puede llevar sufijo 'R' inline para marcar inversión, visible de
// un vistazo junto a los demás — en vez de un booleano posicional
// disperso en 60 llamadas. El número original del cuestionario (1-60) se
// conserva en el id para trazabilidad con FAD.R.
const TEXTO_ITEM = {
  1: 'Planear actividades familiares es difícil porque nos malinterpretamos entre nosotros.',
  2: 'Resolvemos la mayoría de los problemas cotidianos del hogar.',
  3: 'Cuando alguien está molesto/a, los demás saben por qué.',
  4: 'Cuando le pides a alguien que haga algo, tienes que revisar que lo haya hecho.',
  5: 'Si alguien tiene un problema, los demás se involucran demasiado.',
  6: 'En momentos de crisis, podemos apoyarnos entre nosotros.',
  7: 'No sabemos qué hacer cuando surge una emergencia.',
  8: 'A veces se nos acaban cosas que necesitamos.',
  9: 'Nos cuesta mostrar afecto entre nosotros.',
  10: 'Nos aseguramos de que los miembros de la familia cumplan con sus responsabilidades familiares.',
  11: 'No podemos hablar entre nosotros sobre la tristeza que sentimos.',
  12: 'Por lo general, actuamos según las decisiones que tomamos frente a los problemas.',
  13: 'Solo consigues el interés de los demás cuando algo es importante para ellos.',
  14: 'No se puede saber cómo se siente una persona por lo que dice.',
  15: 'Las tareas familiares no se reparten lo suficiente.',
  16: 'Cada persona es aceptada tal como es.',
  17: 'Es fácil salirse con la suya al romper las reglas.',
  18: 'Las personas dicen las cosas directamente en vez de insinuarlas.',
  19: 'Algunos de nosotros simplemente no respondemos emocionalmente.',
  20: 'Sabemos qué hacer en una emergencia.',
  21: 'Evitamos hablar de nuestros miedos y preocupaciones.',
  22: 'Es difícil hablar entre nosotros sobre sentimientos de ternura.',
  23: 'Tenemos dificultades para pagar nuestras cuentas.',
  24: 'Después de que nuestra familia intenta resolver un problema, solemos hablar sobre si funcionó o no.',
  25: 'Somos demasiado egocéntricos/as.',
  26: 'Podemos expresarnos sentimientos entre nosotros.',
  27: 'No tenemos expectativas claras sobre los hábitos de higiene.',
  28: 'No nos demostramos el cariño que sentimos.',
  29: 'Hablamos directamente con las personas en vez de usar intermediarios.',
  30: 'Cada uno de nosotros tiene tareas y responsabilidades específicas.',
  31: 'Hay muchos sentimientos negativos en la familia.',
  32: 'Tenemos reglas sobre no golpear a las personas.',
  33: 'Nos involucramos entre nosotros solo cuando algo nos interesa.',
  34: 'Hay poco tiempo para dedicarnos a intereses personales.',
  35: 'Frecuentemente no decimos lo que realmente queremos decir.',
  36: 'Nos sentimos aceptados/as tal como somos.',
  37: 'Mostramos interés entre nosotros solo cuando podemos obtener algo personalmente a cambio.',
  38: 'Resolvemos la mayoría de los conflictos emocionales que surgen.',
  39: 'La ternura queda en segundo plano frente a otras cosas en nuestra familia.',
  40: 'Hablamos sobre quién debe hacer las tareas del hogar.',
  41: 'Tomar decisiones es un problema para nuestra familia.',
  42: 'Nuestra familia muestra interés entre sí solo cuando pueden obtener algo a cambio.',
  43: 'Somos francos entre nosotros.',
  44: 'No mantenemos ninguna regla o norma.',
  45: 'Si le piden algo a alguien, hay que recordárselo.',
  46: 'Somos capaces de tomar decisiones sobre cómo resolver los problemas.',
  47: 'Si se rompen las reglas, no sabemos qué esperar.',
  48: 'En nuestra familia, todo se vale.',
  49: 'Expresamos ternura.',
  50: 'Afrontamos los problemas que involucran sentimientos.',
  51: 'No nos llevamos bien entre nosotros.',
  52: 'No nos hablamos cuando estamos enojados/as.',
  53: 'En general, estamos insatisfechos/as con las tareas familiares que se nos asignan.',
  54: 'Aunque tenemos buenas intenciones, nos entrometemos demasiado en la vida de los demás.',
  55: 'Hay reglas sobre situaciones peligrosas.',
  56: 'Confiamos nuestros secretos entre nosotros.',
  57: 'Lloramos abiertamente.',
  58: 'No contamos con transporte adecuado.',
  59: 'Cuando no nos gusta algo que alguien hizo, se lo decimos.',
  60: 'Tratamos de pensar en distintas formas de resolver los problemas.',
};

function items(spec) {
  return spec.map((n) => {
    const invertido = typeof n === 'string' && n.endsWith('R');
    const num = invertido ? Number(n.slice(0, -1)) : n;
    return { id: `fad${num}`, texto: TEXTO_ITEM[num], invertido };
  });
}

const ITEMS_PROBLEMAS = items([2, 12, 24, 38, 50, 60]);
const ITEMS_COMUNICACION = items([3, 18, 29, 43, 59, '14R', '22R', '35R', '52R']);
const ITEMS_ROLES = items([10, 30, 40, '4R', '8R', '15R', '23R', '34R', '45R', '53R', '58R']);
const ITEMS_RESPUESTA_AFECTIVA = items([49, 57, '9R', '19R', '28R', '39R']);
const ITEMS_INVOLUCRAMIENTO_AFECTIVO = items(['5R', '13R', '25R', '33R', '37R', '42R', '54R']);
const ITEMS_CONTROL_CONDUCTA = items([20, 32, 55, '7R', '17R', '27R', '44R', '47R', '48R']);
const ITEMS_FUNCIONAMIENTO_GENERAL = items([6, 16, 26, 36, 46, 56, '1R', '11R', '21R', '31R', '41R', '51R']);

const NOMBRE_SUB = {
  problemas: 'Resolución de Problemas',
  comunicacion: 'Comunicación',
  roles: 'Roles',
  respuesta_afectiva: 'Respuesta Afectiva',
  involucramiento_afectivo: 'Involucramiento Afectivo',
  control_conducta: 'Control de Conducta',
  funcionamiento_general: 'Funcionamiento General',
};

// Corte descriptivo propio del equipo (no oficial — el instrumento no trae
// puntos de corte). Puntaje MÁS ALTO = MÁS dificultad en este instrumento.
export function nivel(media) {
  if (media <= 2.0) return 'saludable';
  if (media <= 3.0) return 'cierta_dificultad';
  return 'dificultad_marcada';
}

export const ETIQUETA_NIVEL = {
  saludable: 'funcionamiento saludable percibido',
  cierta_dificultad: 'área con cierta dificultad',
  dificultad_marcada: 'área con dificultad marcada',
};

function reglaFortalezaConsistente({ puntajes }) {
  const claves = Object.keys(puntajes);
  if (!claves.every((k) => nivel(puntajes[k]) === 'saludable')) return null;
  return {
    codigo: 'FAD_FORTALEZA_CONSISTENTE',
    nivel: 'fortaleza',
    titulo: 'Funcionamiento familiar saludable en las 7 áreas',
    evidencia: claves.map((k) => `${NOMBRE_SUB[k]}: ${puntajes[k].toFixed(2)}/4 (saludable)`),
    lectura: 'No se identifican áreas de dificultad marcada en ninguna de las 7 dimensiones evaluadas.',
    preguntas: ['¿Qué prácticas familiares reconoce la familia detrás de este resultado?'],
    estrategias: ['Reconocer explícitamente estos resultados como una fortaleza a mantener.'],
  };
}

function reglaDificultadGeneralizada({ puntajes }) {
  const claves = Object.keys(puntajes);
  const marcadas = claves.filter((k) => nivel(puntajes[k]) === 'dificultad_marcada');
  if (marcadas.length < 5) return null;
  return {
    codigo: 'FAD_DIFICULTAD_GENERALIZADA',
    nivel: 'profundizacion',
    titulo: 'Dificultad generalizada en el funcionamiento familiar',
    evidencia: claves.map((k) => `${NOMBRE_SUB[k]}: ${puntajes[k].toFixed(2)}/4 (${ETIQUETA_NIVEL[nivel(puntajes[k])]})`),
    lectura: `El funcionamiento familiar muestra dificultad marcada en ${marcadas.length} de 7 áreas evaluadas — no es un punto aislado, sino un patrón que afecta la mayoría de las dimensiones.`,
    preguntas: ['¿Cuál de estas áreas siente la familia que más urge trabajar primero?'],
    estrategias: ['Revisar con el equipo si el caso cumple criterios de priorización del servicio antes de definir el plan de acompañamiento.'],
    riesgos: ['Dificultad marcada en la mayoría de las áreas del funcionamiento familiar es un factor relevante para la priorización y el seguimiento del caso.'],
  };
}

function reglaDificultadFocalizada({ puntajes }) {
  const claves = Object.keys(puntajes);
  const marcadas = claves.filter((k) => nivel(puntajes[k]) === 'dificultad_marcada');
  const resto = claves.filter((k) => !marcadas.includes(k));
  if (marcadas.length < 1 || marcadas.length > 2) return null;
  if (!resto.every((k) => nivel(puntajes[k]) === 'saludable')) return null;
  return {
    codigo: 'FAD_DIFICULTAD_FOCALIZADA',
    nivel: 'oportunidad',
    titulo: `Dificultad focalizada en ${marcadas.map((k) => NOMBRE_SUB[k]).join(' y ')}`,
    evidencia: claves.map((k) => `${NOMBRE_SUB[k]}: ${puntajes[k].toFixed(2)}/4 (${ETIQUETA_NIVEL[nivel(puntajes[k])]})`),
    lectura: `Se identifica un área específica de dificultad marcada (${marcadas.map((k) => NOMBRE_SUB[k]).join(', ')}), mientras el resto del funcionamiento familiar se percibe saludable.`,
    preguntas: marcadas.map((k) => `¿Qué hace más difícil el área de "${NOMBRE_SUB[k]}" para la familia en este momento?`),
    estrategias: [`Profundizar específicamente en ${marcadas.map((k) => NOMBRE_SUB[k]).join(' y ')} en el próximo encuentro, sin asumir que las demás áreas también necesitan atención.`],
  };
}

// La subescala "Funcionamiento General" mide la percepción global; si esta
// se ve saludable pero varias subescalas específicas muestran dificultad
// marcada, hay una discordancia que ninguna de las dos por separado
// mostraría — puede co-ocurrir con otras reglas (no es excluyente).
function reglaPercepcionDiscordante({ puntajes }) {
  if (nivel(puntajes.funcionamiento_general) !== 'saludable') return null;
  const especificas = Object.keys(puntajes).filter((k) => k !== 'funcionamiento_general');
  const marcadas = especificas.filter((k) => nivel(puntajes[k]) === 'dificultad_marcada');
  if (marcadas.length < 2) return null;
  return {
    codigo: 'FAD_PERCEPCION_DISCORDANTE',
    nivel: 'profundizacion',
    titulo: 'Percepción global no refleja dificultades específicas',
    evidencia: [`Funcionamiento General: ${puntajes.funcionamiento_general.toFixed(2)}/4 (saludable)`, ...marcadas.map((k) => `${NOMBRE_SUB[k]}: ${puntajes[k].toFixed(2)}/4 (dificultad marcada)`)],
    lectura: 'La percepción general de la familia sobre su propio funcionamiento no refleja las dificultades específicas identificadas en otras subescalas — vale la pena explorar esta diferencia con la familia, no solo reportarla.',
    preguntas: ['¿La familia reconoce estas dificultades específicas al conversar sobre ellas, aunque su percepción general sea positiva?'],
    estrategias: ['Explorar esta discordancia directamente en la conversación en vez de tomar la percepción general como el resumen completo del funcionamiento familiar.'],
  };
}

// Cubre exhaustivamente el resto de combinaciones (ni todas saludables, ni
// ≥5 en dificultad marcada): identifica dinámicamente el área con más y
// con menos dificultad entre las 7 evaluadas.
function reglaMixto({ puntajes }) {
  const claves = Object.keys(puntajes);
  const todasSaludables = claves.every((k) => nivel(puntajes[k]) === 'saludable');
  const marcadas = claves.filter((k) => nivel(puntajes[k]) === 'dificultad_marcada');
  if (todasSaludables || marcadas.length >= 5) return null;

  const ordenadas = [...claves].sort((a, b) => puntajes[b] - puntajes[a]);
  const masDificil = ordenadas[0];
  const masSaludable = ordenadas[ordenadas.length - 1];
  return {
    codigo: 'FAD_MIXTO',
    nivel: 'oportunidad',
    titulo: 'Funcionamiento familiar con niveles mixtos entre áreas',
    evidencia: claves.map((k) => `${NOMBRE_SUB[k]}: ${puntajes[k].toFixed(2)}/4 (${ETIQUETA_NIVEL[nivel(puntajes[k])]})`),
    lectura: `El funcionamiento percibido varía según el área: "${NOMBRE_SUB[masSaludable]}" es la que se percibe más saludable, mientras "${NOMBRE_SUB[masDificil]}" es la que muestra más dificultad.`,
    preguntas: [`¿Qué hace que "${NOMBRE_SUB[masSaludable]}" funcione bien para la familia?`, `¿Qué dificultades identifica la familia en "${NOMBRE_SUB[masDificil]}"?`],
  };
}

export const MCMASTER_FAD = {
  id: 'FAD',
  nombre: 'Funcionamiento Familiar (McMaster FAD)',
  descripcion: 'Evalúa 7 áreas del funcionamiento familiar: resolución de problemas, comunicación, roles, respuesta afectiva, involucramiento afectivo, control de conducta y funcionamiento general.',
  fuente: 'docs/catalogo-instrumentos-psicosociales.md#mcmaster-family-assessment-device-fad',
  formula: 'promedio',
  escalaMin: 1,
  escalaMax: 4,
  // A diferencia de los demás instrumentos del módulo, aquí un puntaje
  // MÁS ALTO indica MÁS dificultad (ver comentario de cabecera) — se
  // declara para que la calificación transversal (1-5) del motor
  // (motorInstrumento.js) invierta la normalización correctamente.
  orientacion: 'invertida',
  opciones: OPCIONES,
  nombreSubescala: NOMBRE_SUB,
  subescalas: [
    { id: 'problemas', nombre: 'Resolución de Problemas', items: ITEMS_PROBLEMAS },
    { id: 'comunicacion', nombre: 'Comunicación', items: ITEMS_COMUNICACION },
    { id: 'roles', nombre: 'Roles', items: ITEMS_ROLES },
    { id: 'respuesta_afectiva', nombre: 'Respuesta Afectiva', items: ITEMS_RESPUESTA_AFECTIVA },
    { id: 'involucramiento_afectivo', nombre: 'Involucramiento Afectivo', items: ITEMS_INVOLUCRAMIENTO_AFECTIVO },
    { id: 'control_conducta', nombre: 'Control de Conducta', items: ITEMS_CONTROL_CONDUCTA },
    { id: 'funcionamiento_general', nombre: 'Funcionamiento General', items: ITEMS_FUNCIONAMIENTO_GENERAL },
  ],
  reglas: [reglaFortalezaConsistente, reglaDificultadGeneralizada, reglaDificultadFocalizada, reglaPercepcionDiscordante, reglaMixto],
};
