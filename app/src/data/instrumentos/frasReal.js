// FRAS-54 — Family Resilience Assessment Scale (Sixbey, 2005), esfera C.
// Familia. Instrumento REAL, no híbrido: los 54 ítems y la clave de
// asignación a subescalas se extrajeron directamente (con verificación
// visual página por página, no solo texto automático) de la disertación
// doctoral original de Meggen Sixbey, "Development of the Family
// Resilience Assessment Scale to identify family resilience constructs"
// (University of Florida, 2005), publicada abiertamente en el repositorio
// institucional de la universidad (ufdc.ufl.edu). Apéndice C trae el
// banco de 66 ítems administrados; Apéndice J confirma exactamente cuáles
// 54 de esos 66 componen la escala final, agrupados en 6 factores, con
// cargas factoriales, alfa de confiabilidad y los ítems de puntuación
// inversa marcados — 27+8+6+6+4+3 = 54, cuadra con el nombre "FRAS-54".
//
// Por qué esto NO reemplaza a frasHibrido.js: los ítems aquí son una
// TRADUCCIÓN PROPIA del inglés original, no una adaptación validada al
// español — mismo tratamiento que ya se le dio a MSPSS. FRAS_HIB (ítems
// 100% de diseño propio) queda disponible aparte; esta es una alternativa
// con contenido auténtico del instrumento real, no un reemplazo.
//
// Ítem 60 ("We tell each other how much we care for one___"): el propio
// documento fuente trae el texto cortado por el ancho de la celda de la
// tabla — se completó como "para con el otro" por ser la terminación
// gramatical más natural, no verificada contra el enunciado exacto.
//
// Escala de respuesta original: 4 puntos (Strongly Agree/Agree/
// Disagree/Strongly Disagree). Sin puntos de corte clínicos oficiales
// reproducidos en la fuente revisada — los niveles bajo/medio/alto usados
// en las reglas son un corte descriptivo propio, no un diagnóstico.

const OPCIONES = [
  { valor: 1, etiqueta: 'Totalmente en desacuerdo' },
  { valor: 2, etiqueta: 'En desacuerdo' },
  { valor: 3, etiqueta: 'De acuerdo' },
  { valor: 4, etiqueta: 'Totalmente de acuerdo' },
];

const TEXTO_ITEM = {
  3: 'La estructura de nuestra familia es flexible para enfrentar lo inesperado.',
  5: 'Nuestros amigos nos valoran a nosotros y a quienes somos.',
  8: 'Las cosas que hacemos los unos por los otros nos hacen sentir parte de la familia.',
  9: 'Aceptamos los eventos estresantes como parte de la vida.',
  10: 'Aceptamos que los problemas ocurren de manera inesperada.',
  11: 'Todos tenemos voz en las decisiones familiares importantes.',
  12: 'Somos capaces de superar el dolor y llegar a un entendimiento.',
  13: 'Somos capaces de adaptarnos a las exigencias que se nos presentan como familia.',
  16: 'Estamos abiertos a nuevas formas de hacer las cosas en nuestra familia.',
  17: 'Nos sentimos comprendidos por los demás miembros de la familia.',
  18: 'Les pedimos ayuda y asistencia a los vecinos.',
  19: 'Asistimos a servicios religiosos (iglesia/sinagoga/mezquita).',
  21: 'Creemos que podemos manejar nuestros problemas.',
  22: 'Podemos pedir aclaración cuando no nos entendemos entre nosotros.',
  23: 'Podemos ser honestos y directos entre nosotros en nuestra familia.',
  24: 'Podemos desahogarnos en casa sin molestar a alguien.',
  25: 'Podemos ceder o llegar a acuerdos cuando surgen problemas.',
  26: 'Podemos manejar las diferencias familiares al aceptar una pérdida.',
  27: 'Podemos contar con las personas de esta comunidad.',
  28: 'Podemos cuestionar el significado detrás de los mensajes en nuestra familia.',
  29: 'Podemos resolver problemas grandes.',
  30: 'Podemos salir adelante si surge otro problema.',
  31: 'Podemos hablar sobre la forma en que nos comunicamos en nuestra familia.',
  32: 'Podemos superar las dificultades como familia.',
  33: 'Nos consultamos entre nosotros sobre las decisiones.',
  34: 'Definimos los problemas de forma positiva para resolverlos.',
  35: 'Discutimos los problemas y nos sentimos bien con las soluciones.',
  36: 'Discutimos las cosas hasta llegar a una solución.',
  38: 'Nos sentimos libres de expresar nuestras opiniones.',
  39: 'Nos sentimos bien dedicando tiempo y energía a nuestra familia.',
  40: 'Sentimos que las personas de esta comunidad están dispuestas a ayudar en una emergencia.',
  41: 'Nos sentimos seguros viviendo en esta comunidad.',
  42: 'Sentimos que los demás miembros de la familia nos dan por sentado(a)s.',
  43: 'Sentimos que somos fuertes para enfrentar grandes problemas.',
  46: 'Tenemos fe en un ser supremo.',
  47: 'Tenemos la fortaleza para resolver nuestros problemas.',
  48: 'Nos guardamos nuestros sentimientos para nosotros mismos.',
  49: 'Sabemos que hay ayuda comunitaria si hay problemas.',
  50: 'Sabemos que somos importantes para nuestros amigos.',
  51: 'Aprendemos de los errores de los demás.',
  52: 'Decimos en serio lo que nos decimos entre nosotros en la familia.',
  54: 'Participamos en actividades religiosas.',
  55: 'Recibimos regalos y favores de los vecinos.',
  56: 'Buscamos consejo de líderes o consejeros religiosos.',
  57: 'Rara vez escuchamos las preocupaciones o problemas de los miembros de la familia.',
  58: 'Compartimos las responsabilidades en la familia.',
  59: 'Mostramos amor y afecto por los miembros de la familia.',
  60: 'Nos decimos cuánto nos importamos los unos para con el otro.',
  61: 'Pensamos que esta es una buena comunidad para criar hijos.',
  62: 'Pensamos que no deberíamos involucrarnos demasiado con las personas de esta comunidad.',
  63: 'Confiamos en que las cosas saldrán bien incluso en momentos difíciles.',
  64: 'Probamos nuevas formas de abordar los problemas.',
  65: 'Entendemos la comunicación de los demás miembros de la familia.',
  66: 'Nos esforzamos para que ningún miembro de la familia resulte herido emocional o físicamente.',
};

function items(spec) {
  return spec.map((n) => {
    const invertido = typeof n === 'string' && n.endsWith('R');
    const num = invertido ? Number(n.slice(0, -1)) : n;
    return { id: `fras_${num}`, texto: TEXTO_ITEM[num], invertido };
  });
}

const ITEMS_FCPS = items([3, 11, 12, 13, 16, 17, 22, 23, 24, 25, 26, 28, 31, 32, 33, 34, 35, 36, 38, 39, 51, 52, 58, 60, 64, 65, 66]);
const ITEMS_USER = items([18, 27, 40, 41, 49, 50, 55, 61]);
const ITEMS_MPO = items([21, 29, 30, 43, 47, 63]);
const ITEMS_FC = items([5, '42R', '48R', '57R', 59, '62R']);
const ITEMS_FS = items([19, 46, 54, 56]);
const ITEMS_AMMA = items([8, 9, 10]);

const NOMBRE_DOMINIO = {
  fcps: 'Comunicación y resolución de problemas',
  user: 'Uso de recursos sociales y económicos',
  mpo: 'Mantener una perspectiva positiva',
  fc: 'Conexión familiar',
  fs: 'Espiritualidad familiar',
  amma: 'Capacidad de dar sentido a la adversidad',
};

function nivel(media) {
  if (media <= 2.3) return 'bajo';
  if (media >= 3.7) return 'alto';
  return 'medio';
}

function reglaComunicacionConApoyoExterno({ puntajes }) {
  if (nivel(puntajes.fcps) !== 'alto') return null;
  if (nivel(puntajes.user) !== 'alto') return null;
  return {
    codigo: 'FRAS_COMUNICACION_CON_APOYO',
    nivel: 'fortaleza',
    titulo: 'Comunicación familiar sólida con apoyo comunitario activo',
    evidencia: [`Comunicación y resolución de problemas: ${puntajes.fcps.toFixed(1)}/4`, `Uso de recursos sociales y económicos: ${puntajes.user.toFixed(1)}/4`],
    lectura: 'La familia reporta buena capacidad de comunicarse y resolver problemas internamente, además de sentir que cuenta con la comunidad como recurso — combinación de fortaleza interna y externa.',
    preguntas: ['¿Qué de esto reconoce la familia en su día a día?'],
    estrategias: ['Reconocer explícitamente esta combinación de recursos como una fortaleza a mantener.'],
  };
}

function reglaComunicacionSinApoyoExterno({ puntajes }) {
  if (nivel(puntajes.fcps) !== 'alto') return null;
  if (nivel(puntajes.user) !== 'bajo') return null;
  return {
    codigo: 'FRAS_COMUNICACION_SIN_APOYO',
    nivel: 'oportunidad',
    titulo: 'Comunicación familiar sólida, sin red comunitaria activada',
    evidencia: [`Comunicación y resolución de problemas: ${puntajes.fcps.toFixed(1)}/4`, `Uso de recursos sociales y económicos: ${puntajes.user.toFixed(1)}/4`],
    lectura: 'La familia se apoya bien en sí misma para resolver problemas, pero no percibe a la comunidad como un recurso disponible — la fortaleza interna no está respaldada por redes externas.',
    preguntas: ['¿Qué instituciones, vecinos o programas del territorio conoce la familia?'],
    estrategias: ['Explorar junto con el Mapa de Pertenencia (F1) qué redes comunitarias podrían activarse.'],
  };
}

function reglaComunicacionAFortalecer({ puntajes }) {
  if (nivel(puntajes.fcps) !== 'bajo') return null;
  return {
    codigo: 'FRAS_COMUNICACION_A_FORTALECER',
    nivel: 'profundizacion',
    titulo: 'Comunicación y resolución de problemas a fortalecer',
    evidencia: [`Comunicación y resolución de problemas: ${puntajes.fcps.toFixed(1)}/4`],
    lectura: 'Esta es la dimensión con más peso en el instrumento (27 de los 54 ítems); un puntaje bajo aquí es la señal más relevante para priorizar en el acompañamiento.',
    preguntas: ['¿Qué dificulta hoy que la familia hable y resuelva los problemas juntos?'],
    estrategias: ['Priorizar estrategias de comunicación familiar y resolución conjunta de problemas en el plan de acompañamiento.'],
  };
}

function reglaSentidoYEspiritualidad({ puntajes }) {
  if (nivel(puntajes.amma) !== 'alto') return null;
  if (nivel(puntajes.fs) !== 'alto') return null;
  return {
    codigo: 'FRAS_SENTIDO_ESPIRITUALIDAD',
    nivel: 'fortaleza',
    titulo: 'Capacidad de dar sentido a la adversidad con apoyo espiritual',
    evidencia: [`Capacidad de dar sentido a la adversidad: ${puntajes.amma.toFixed(1)}/4`, `Espiritualidad familiar: ${puntajes.fs.toFixed(1)}/4`],
    lectura: 'La familia acepta los eventos difíciles como parte de la vida y encuentra en su práctica espiritual o de fe un recurso para afrontarlos.',
    preguntas: ['¿Cómo ha ayudado esto a la familia en momentos difíciles anteriores?'],
  };
}

// Catch-all exhaustivo (mismo principio que BFI2): los 6 factores tienen
// significados distintos entre sí, así que el resumen solo presenta los
// puntajes sin calificar ninguno de "bueno" o "malo" por defecto.
function reglaResumen({ puntajes }) {
  return {
    codigo: 'FRAS_PERFIL_GENERAL',
    nivel: 'oportunidad',
    titulo: 'Perfil de resiliencia familiar (FRAS-54)',
    evidencia: Object.entries(NOMBRE_DOMINIO).map(([id, nombre]) => `${nombre}: ${puntajes[id].toFixed(1)}/4`),
    lectura: 'El perfil no encaja en ninguno de los patrones específicos definidos — los 6 puntajes quedan disponibles para conversar con la familia.',
    preguntas: ['¿Qué de este perfil reconoce la familia, y qué no tanto?'],
  };
}

export const FRAS_REAL = {
  id: 'FRAS_REAL',
  nombre: 'Resiliencia Familiar (FRAS-54)',
  descripcion: 'Capacidad de adaptación familiar ante la crisis, en 6 factores. Versión real del Family Resilience Assessment Scale (Sixbey, 2005) — traducción propia de los 54 ítems originales, no una adaptación validada al español.',
  fuente: 'docs/catalogo-instrumentos-psicosociales.md#fras-54--family-resilience-assessment-scale',
  formula: 'promedio',
  escalaMin: 1,
  escalaMax: 4,
  opciones: OPCIONES,
  subescalas: [
    { id: 'fcps', nombre: NOMBRE_DOMINIO.fcps, items: ITEMS_FCPS },
    { id: 'user', nombre: NOMBRE_DOMINIO.user, items: ITEMS_USER },
    { id: 'mpo', nombre: NOMBRE_DOMINIO.mpo, items: ITEMS_MPO },
    { id: 'fc', nombre: NOMBRE_DOMINIO.fc, items: ITEMS_FC },
    { id: 'fs', nombre: NOMBRE_DOMINIO.fs, items: ITEMS_FS },
    { id: 'amma', nombre: NOMBRE_DOMINIO.amma, items: ITEMS_AMMA },
  ],
  reglas: [reglaComunicacionConApoyoExterno, reglaComunicacionSinApoyoExterno, reglaComunicacionAFortalecer, reglaSentidoYEspiritualidad],
  reglaResumen,
};
