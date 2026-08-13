// FQOL Scale — Beach Center Family Quality of Life Scale (Hoffman, Marquis,
// Poston, Summers & Turnbull, 2006).
//
// Fuente de los 25 ítems: instrumentos/Family Quality of Life Psychometric
// Characteristics and Scoring Key.pdf, extraídos directamente con
// pdftotext. Traducción al español: propia del equipo — el PDF fuente solo
// trae el original en inglés y el catálogo ya documenta que no hay
// validación hispanohablante confirmada en la carpeta. Licencia: "© Beach
// Center on Disability, 2015. Permission granted to reproduce for
// educational purposes" — el propio documento fuente aclara además "not to
// be used to determine or deny eligibility... nor is it a clinical measure
// for diagnostic purposes", coherente con el principio ético del proyecto.
//
// Particularidad de este instrumento: la subescala "Apoyo por discapacidad"
// solo tiene sentido si la familia tiene un integrante con discapacidad —
// se maneja como subescala condicional en el componente de formulario, no
// aquí (ver FQOLHerramienta.jsx), para no forzar un puntaje "bajo" por una
// pregunta que no aplica. Reglas de interacción:
// docs/reglas-puntuacion-interpretacion.md, sección FQOL Scale.

const ITEMS_FAMILIA = [
  { id: 'familia1', texto: 'Mi familia disfruta pasar tiempo junta.' },
  { id: 'familia2', texto: 'Los miembros de mi familia hablan abiertamente entre sí.' },
  { id: 'familia3', texto: 'Mi familia resuelve los problemas juntos.' },
  { id: 'familia4', texto: 'Los miembros de mi familia se apoyan mutuamente para lograr sus metas.' },
  { id: 'familia5', texto: 'Los miembros de mi familia demuestran que se aman y se cuidan mutuamente.' },
  { id: 'familia6', texto: 'Mi familia es capaz de afrontar los altibajos de la vida.' },
];

const ITEMS_CRIANZA = [
  { id: 'crianza1', texto: 'Los miembros de la familia ayudan a los niños/as a aprender a ser independientes.' },
  { id: 'crianza2', texto: 'Los miembros de la familia ayudan a los niños/as con las tareas escolares y actividades.' },
  { id: 'crianza3', texto: 'Los miembros de la familia les enseñan a los niños/as a llevarse bien con los demás.' },
  { id: 'crianza4', texto: 'Los adultos de mi familia les enseñan a los niños/as a tomar buenas decisiones.' },
  { id: 'crianza5', texto: 'Los adultos de mi familia conocen a otras personas importantes en la vida de los niños/as (amigos, docentes).' },
  { id: 'crianza6', texto: 'Los adultos de mi familia tienen tiempo para atender las necesidades individuales de cada niño/a.' },
];

const ITEMS_EMOCIONAL = [
  { id: 'emocional1', texto: 'Mi familia cuenta con el apoyo que necesita para aliviar el estrés.' },
  { id: 'emocional2', texto: 'Los miembros de mi familia tienen amigos u otras personas que les brindan apoyo.' },
  { id: 'emocional3', texto: 'Los miembros de mi familia tienen algo de tiempo para dedicarse a sus propios intereses.' },
  { id: 'emocional4', texto: 'Mi familia cuenta con ayuda externa disponible para atender las necesidades especiales de todos sus integrantes.' },
];

const ITEMS_MATERIAL = [
  { id: 'material1', texto: 'Los miembros de mi familia cuentan con transporte para llegar a los lugares que necesitan.' },
  { id: 'material2', texto: 'Mi familia recibe atención odontológica cuando la necesita.' },
  { id: 'material3', texto: 'Mi familia recibe atención médica cuando la necesita.' },
  { id: 'material4', texto: 'Mi familia cuenta con la forma de cubrir sus gastos.' },
  { id: 'material5', texto: 'Mi familia se siente segura en casa, el trabajo, la escuela y el barrio.' },
];

const ITEMS_DISCAPACIDAD = [
  { id: 'discapacidad1', texto: 'Mi familiar con necesidades especiales cuenta con apoyo para avanzar en la escuela o el trabajo.' },
  { id: 'discapacidad2', texto: 'Mi familiar con necesidades especiales cuenta con apoyo para avanzar en el hogar.' },
  { id: 'discapacidad3', texto: 'Mi familiar con necesidades especiales cuenta con apoyo para hacer amigos.' },
  { id: 'discapacidad4', texto: 'Mi familia tiene una buena relación con los proveedores de servicios que trabajan con nuestro familiar con discapacidad.' },
];

const OPCIONES = [
  { valor: 1, etiqueta: 'Muy insatisfecho/a' },
  { valor: 2, etiqueta: 'Insatisfecho/a' },
  { valor: 3, etiqueta: 'Ni satisfecho/a ni insatisfecho/a' },
  { valor: 4, etiqueta: 'Satisfecho/a' },
  { valor: 5, etiqueta: 'Muy satisfecho/a' },
];

function nivel(media) {
  if (media <= 2.3) return 'baja';
  if (media <= 3.6) return 'media';
  return 'alta';
}

const NOMBRE_SUB = {
  familia: 'Interacción Familiar',
  crianza: 'Crianza',
  emocional: 'Bienestar Emocional',
  material: 'Bienestar Físico/Material',
  discapacidad: 'Apoyo por discapacidad',
};

function reglaSatisfaccionGeneralizada({ puntajes }) {
  const claves = Object.keys(puntajes);
  if (!claves.every((k) => nivel(puntajes[k]) === 'alta')) return null;
  return {
    codigo: 'FQOL_SATISFACCION_GENERALIZADA',
    nivel: 'fortaleza',
    titulo: 'Satisfacción generalizada con la calidad de vida familiar',
    evidencia: claves.map((k) => `${NOMBRE_SUB[k]}: ${puntajes[k].toFixed(1)}/5 (alta)`),
    lectura: 'Las subescalas evaluadas muestran satisfacción alta en todos los dominios considerados.',
    preguntas: ['¿Qué cree que sostiene esta satisfacción en los distintos aspectos de la vida familiar?'],
    estrategias: ['Reconocer explícitamente estos resultados con la familia como una fortaleza a mantener.'],
  };
}

function reglaInsatisfaccionGeneralizada({ puntajes }) {
  const claves = Object.keys(puntajes);
  if (!claves.every((k) => nivel(puntajes[k]) === 'baja')) return null;
  return {
    codigo: 'FQOL_INSATISFACCION_GENERALIZADA',
    nivel: 'profundizacion',
    titulo: 'Insatisfacción generalizada con la calidad de vida familiar',
    evidencia: claves.map((k) => `${NOMBRE_SUB[k]}: ${puntajes[k].toFixed(1)}/5 (baja)`),
    lectura: 'Las subescalas evaluadas muestran baja satisfacción en todos los dominios considerados — señal relevante para priorizar el caso.',
    preguntas: ['¿Cuál de estos aspectos siente que más necesita fortalecerse primero?'],
    estrategias: ['Revisar con el equipo si el caso cumple criterios de priorización del servicio antes de definir el plan de acompañamiento.'],
    riesgos: ['Insatisfacción baja y generalizada en todos los dominios evaluados es un factor relevante para la priorización y el seguimiento del caso.'],
  };
}

// Discordancia específica: recursos materiales sin bienestar emocional —
// solo tiene sentido si ambas subescalas se están evaluando.
function reglaDiscordanciaMaterialEmocional({ puntajes }) {
  if (puntajes.material === undefined || puntajes.emocional === undefined) return null;
  if (nivel(puntajes.material) !== 'alta' || nivel(puntajes.emocional) !== 'baja') return null;
  return {
    codigo: 'FQOL_DISCORDANCIA_MATERIAL_EMOCIONAL',
    nivel: 'oportunidad',
    titulo: 'Satisfacción material sin bienestar emocional',
    evidencia: [`Bienestar Físico/Material: ${puntajes.material.toFixed(1)}/5 (alta)`, `Bienestar Emocional: ${puntajes.emocional.toFixed(1)}/5 (baja)`],
    lectura: 'Contar con recursos materiales no se está traduciendo en bienestar emocional percibido — matiz que ninguna de las dos subescalas muestra por separado.',
    preguntas: ['¿Qué necesitaría la familia para sentirse más apoyada emocionalmente, más allá de lo material?'],
  };
}

// Cubre exhaustivamente el resto de combinaciones (ninguna de las 3 reglas
// anteriores aplica): identifica dinámicamente la subescala más alta y la
// más baja entre las que efectivamente se están evaluando.
function reglaMixto({ puntajes }) {
  const claves = Object.keys(puntajes);
  const todasAlta = claves.every((k) => nivel(puntajes[k]) === 'alta');
  const todasBaja = claves.every((k) => nivel(puntajes[k]) === 'baja');
  if (todasAlta || todasBaja) return null;

  const ordenadas = [...claves].sort((a, b) => puntajes[b] - puntajes[a]);
  const mas = ordenadas[0];
  const menos = ordenadas[ordenadas.length - 1];
  return {
    codigo: 'FQOL_MIXTO',
    nivel: 'oportunidad',
    titulo: 'Calidad de vida familiar con niveles mixtos',
    evidencia: claves.map((k) => `${NOMBRE_SUB[k]}: ${puntajes[k].toFixed(1)}/5 (${nivel(puntajes[k])})`),
    lectura: `La satisfacción varía según el dominio: "${NOMBRE_SUB[mas]}" es el que se percibe con más satisfacción, mientras "${NOMBRE_SUB[menos]}" es el más bajo.`,
    preguntas: [`¿Qué hace que "${NOMBRE_SUB[mas]}" funcione bien para la familia?`, `¿Qué ayudaría a fortalecer "${NOMBRE_SUB[menos]}"?`],
    estrategias: [`Reconocer y apoyarse en "${NOMBRE_SUB[mas]}" mientras se explora cómo fortalecer "${NOMBRE_SUB[menos]}".`],
  };
}

export const FQOL = {
  id: 'FQOL',
  nombre: 'Calidad de Vida Familiar (FQOL Scale)',
  descripcion: 'Satisfacción de la familia con distintos dominios de su vida: interacción familiar, crianza, bienestar emocional, bienestar físico/material y, si aplica, apoyo relacionado con discapacidad.',
  fuente: 'docs/catalogo-instrumentos-psicosociales.md#fqol-scale-beach-center-family-quality-of-life-scale',
  formula: 'promedio',
  opciones: OPCIONES,
  nombreSubescala: NOMBRE_SUB,
  subescalas: [
    { id: 'familia', nombre: 'Interacción Familiar', items: ITEMS_FAMILIA },
    { id: 'crianza', nombre: 'Crianza', items: ITEMS_CRIANZA },
    { id: 'emocional', nombre: 'Bienestar Emocional', items: ITEMS_EMOCIONAL },
    { id: 'material', nombre: 'Bienestar Físico/Material', items: ITEMS_MATERIAL },
    { id: 'discapacidad', nombre: 'Apoyo por discapacidad', items: ITEMS_DISCAPACIDAD, condicional: true },
  ],
  reglas: [reglaSatisfaccionGeneralizada, reglaInsatisfaccionGeneralizada, reglaDiscordanciaMaterialEmocional, reglaMixto],
};
