// FRAS — Híbrido de Resiliencia Familiar, inspirado en el Family Resilience
// Assessment Scale (Sixbey, 2005; adaptación colombiana: Valencia Londoño,
// Trujillo Orrego, Duque Monsalve & Giraldo Cardona, 2025) y en el modelo
// teórico de resiliencia familiar de Froma Walsh (ver
// docs/mapa-teorico-marcos-conceptuales.md#teoría-de-resiliencia-familiar-walsh).
//
// Por qué es híbrido y no una digitalización directa: el paper de la
// adaptación colombiana (fpsyg-16-1568139.pdf) no reproduce los 54 ítems
// completos — solo una tabla de cargas factoriales por número de ítem (ver
// docs/catalogo-instrumentos-psicosociales.md#fras--family-resilience-assessment-scale-adaptación-colombiana).
// No es un problema de licencia como HEXACO/VIA/WHOQOL — es que la fuente
// disponible no permite reconstruir los ítems reales. Se conserva el
// modelo de 6 dimensiones (verificado, de dominio académico) y se
// redactan preguntas propias, siguiendo el mismo criterio de
// docs/matriz-variables-indicadores.md#variante-híbrida-instrumentos-con-licencia-restringida-o-bloqueada.
//
// Formato de respuesta: mismo estándar "Frecuencia" ya usado en el resto
// del proyecto para preguntas de diseño propio (Nunca · A veces ·
// Frecuentemente · Siempre), no una traducción del Likert original del
// FRAS. Reglas de interacción: docs/reglas-puntuacion-interpretacion.md,
// sección FRAS (híbrido).

const ITEMS_COMUNICACION = [
  { id: 'com1', texto: 'Cuando surge un problema, la familia habla abiertamente sobre él.' },
  { id: 'com2', texto: 'Los miembros de la familia se escuchan unos a otros al tomar decisiones.' },
  { id: 'com3', texto: 'La familia logra ponerse de acuerdo sobre cómo resolver las dificultades.' },
  { id: 'com4', texto: 'Cuando alguien de la familia está preocupado, lo expresa a los demás.' },
];

const ITEMS_RECURSOS = [
  { id: 'rec1', texto: 'La familia sabe a qué instituciones o personas acudir cuando necesita ayuda.' },
  { id: 'rec2', texto: 'La familia cuenta con recursos económicos o de apoyo para enfrentar imprevistos.' },
  { id: 'rec3', texto: 'La familia ha buscado o recibido apoyo de la comunidad en momentos difíciles.' },
  { id: 'rec4', texto: 'La familia conoce los programas o servicios disponibles en su territorio.' },
];

const ITEMS_ACTITUD = [
  { id: 'act1', texto: 'La familia mantiene la esperanza aun en momentos difíciles.' },
  { id: 'act2', texto: 'La familia ve las dificultades como algo que se puede superar.' },
  { id: 'act3', texto: 'Los miembros de la familia se animan mutuamente ante los problemas.' },
  { id: 'act4', texto: 'La familia reconoce lo que ha logrado, incluso en tiempos difíciles.' },
];

const ITEMS_CONEXION = [
  { id: 'con1', texto: 'Los miembros de la familia se sienten unidos entre sí.' },
  { id: 'con2', texto: 'La familia comparte tiempo junta con regularidad.' },
  { id: 'con3', texto: 'Los miembros de la familia se apoyan mutuamente en las decisiones importantes.' },
  { id: 'con4', texto: 'La familia siente que puede contar con sus propios integrantes.' },
];

const ITEMS_ESPIRITUALIDAD = [
  { id: 'esp1', texto: 'La familia encuentra fortaleza en sus creencias espirituales, religiosas o de sentido de vida.' },
  { id: 'esp2', texto: 'Esas creencias o prácticas ayudan a la familia en momentos difíciles.' },
  { id: 'esp3', texto: 'La familia participa en actividades espirituales o comunitarias que le dan sentido.' },
  { id: 'esp4', texto: 'Esas creencias le ayudan a la familia a mantener la esperanza.' },
];

const ITEMS_SENTIDO = [
  { id: 'sen1', texto: 'La familia encuentra algún aprendizaje en las dificultades que ha vivido.' },
  { id: 'sen2', texto: 'La familia puede hablar sobre las experiencias difíciles que ha pasado.' },
  { id: 'sen3', texto: 'La familia reconoce que las dificultades pasadas la han fortalecido de alguna manera.' },
  { id: 'sen4', texto: 'La familia tiene su propia forma de entender por qué le han pasado las cosas difíciles.' },
];

const OPCIONES = [
  { valor: 0, etiqueta: 'Nunca' },
  { valor: 1, etiqueta: 'A veces' },
  { valor: 2, etiqueta: 'Frecuentemente' },
  { valor: 3, etiqueta: 'Siempre' },
];

function nivel(media) {
  if (media <= 1.0) return 'poco_presente';
  if (media <= 2.0) return 'parcialmente_presente';
  return 'consolidado';
}

const NOMBRE_SUB = {
  comunicacion: 'Comunicación y resolución de problemas',
  recursos: 'Recursos sociales y económicos',
  actitud: 'Actitud positiva',
  conexion: 'Conexión familiar',
  espiritualidad: 'Espiritualidad familiar',
  sentido: 'Sentido de la adversidad',
};

function reglaResilienciaConsolidada({ puntajes }) {
  const claves = Object.keys(puntajes);
  if (!claves.every((k) => nivel(puntajes[k]) === 'consolidado')) return null;
  return {
    codigo: 'FRAS_CONSOLIDADA',
    nivel: 'fortaleza',
    titulo: 'Resiliencia familiar consolidada',
    evidencia: claves.map((k) => `${NOMBRE_SUB[k]}: ${puntajes[k].toFixed(1)}/3 (consolidado)`),
    lectura: 'Las 6 dimensiones de resiliencia familiar evaluadas se perciben consolidadas.',
    preguntas: ['¿Qué prácticas o recursos reconoce la familia detrás de esta resiliencia?'],
    estrategias: ['Reconocer explícitamente estos resultados con la familia como una fortaleza a mantener y a la que recurrir en momentos de crisis.'],
  };
}

function reglaAFortalecer({ puntajes }) {
  const claves = Object.keys(puntajes);
  if (!claves.every((k) => nivel(puntajes[k]) === 'poco_presente')) return null;
  return {
    codigo: 'FRAS_A_FORTALECER',
    nivel: 'profundizacion',
    titulo: 'Recursos de resiliencia familiar a fortalecer',
    evidencia: claves.map((k) => `${NOMBRE_SUB[k]}: ${puntajes[k].toFixed(1)}/3 (poco presente)`),
    lectura: 'Las 6 dimensiones evaluadas muestran recursos de resiliencia poco presentes — señal relevante para priorizar el caso.',
    preguntas: ['¿Cuál de estas dimensiones siente la familia que más necesita fortalecerse primero?'],
    estrategias: ['Revisar con el equipo si el caso cumple criterios de priorización del servicio antes de definir el plan de acompañamiento.'],
    riesgos: ['Recursos de resiliencia poco presentes en las 6 dimensiones es un factor relevante para la priorización y el seguimiento del caso.'],
  };
}

// Distinción interna/externa del modelo de Walsh: recursos internos
// (creencias, actitud, conexión) consolidados pero sin activar recursos
// externos (sociales/económicos) — o al revés.
function reglaInternaSinExterna({ puntajes }) {
  const internos = ['actitud', 'conexion', 'sentido'];
  if (!internos.every((k) => nivel(puntajes[k]) === 'consolidado')) return null;
  if (nivel(puntajes.recursos) !== 'poco_presente') return null;
  return {
    codigo: 'FRAS_INTERNA_SIN_EXTERNA',
    nivel: 'oportunidad',
    titulo: 'Resiliencia interna sin recurso externo activado',
    evidencia: ['Actitud positiva, Conexión familiar y Sentido de la adversidad: consolidados', `Recursos sociales y económicos: ${puntajes.recursos.toFixed(1)}/3 (poco presente)`],
    lectura: 'Fortaleza en los recursos internos de la familia, con una brecha específica en el acceso o uso de redes sociales y económicas — conecta directamente con la esfera Redes y el objetivo 3 del servicio.',
    preguntas: ['¿A qué instituciones, programas o personas podría acudir la familia si lo necesitara?'],
    estrategias: ['Explorar junto con el Mapa de Pertenencia (F1) qué redes institucionales o comunitarias podrían activarse.'],
  };
}

function reglaExternaSinInterna({ puntajes }) {
  if (nivel(puntajes.recursos) !== 'consolidado') return null;
  if (nivel(puntajes.conexion) !== 'poco_presente') return null;
  return {
    codigo: 'FRAS_EXTERNA_SIN_INTERNA',
    nivel: 'oportunidad',
    titulo: 'Recurso externo disponible sin activar',
    evidencia: [`Recursos sociales y económicos: ${puntajes.recursos.toFixed(1)}/3 (consolidado)`, `Conexión familiar: ${puntajes.conexion.toFixed(1)}/3 (poco presente)`],
    lectura: 'La familia tiene acceso a redes de apoyo externas, pero la cohesión interna para movilizarlas juntos como unidad parece más débil.',
    preguntas: ['¿Qué ayudaría a la familia a sentirse más unida al enfrentar dificultades?'],
  };
}

// Cubre exhaustivamente el resto (ni todas consolidadas, ni todas poco
// presentes): identifica dinámicamente la dimensión más y menos presente.
function reglaMixto({ puntajes }) {
  const claves = Object.keys(puntajes);
  const todasConsolidadas = claves.every((k) => nivel(puntajes[k]) === 'consolidado');
  const todasPocoPresentes = claves.every((k) => nivel(puntajes[k]) === 'poco_presente');
  if (todasConsolidadas || todasPocoPresentes) return null;

  const ordenadas = [...claves].sort((a, b) => puntajes[b] - puntajes[a]);
  const mas = ordenadas[0];
  const menos = ordenadas[ordenadas.length - 1];
  return {
    codigo: 'FRAS_MIXTO',
    nivel: 'oportunidad',
    titulo: 'Resiliencia familiar con dimensiones desiguales',
    evidencia: claves.map((k) => `${NOMBRE_SUB[k]}: ${puntajes[k].toFixed(1)}/3 (${nivel(puntajes[k]).replace('_', ' ')})`),
    lectura: `Los recursos de resiliencia varían según la dimensión: "${NOMBRE_SUB[mas]}" es la más presente, mientras "${NOMBRE_SUB[menos]}" es la que menos se percibe.`,
    preguntas: [`¿Qué sostiene a "${NOMBRE_SUB[mas]}" como un recurso presente para la familia?`, `¿Qué ayudaría a fortalecer "${NOMBRE_SUB[menos]}"?`],
    estrategias: [`Reconocer y apoyarse en "${NOMBRE_SUB[mas]}" mientras se explora cómo fortalecer "${NOMBRE_SUB[menos]}".`],
  };
}

export const FRAS_HIBRIDO = {
  id: 'FRAS_HIB',
  nombre: 'Resiliencia Familiar (híbrido, inspirado en FRAS)',
  descripcion: 'Explora 6 dimensiones de resiliencia familiar del modelo de Walsh: comunicación, recursos externos, actitud positiva, conexión, espiritualidad y sentido de la adversidad. Preguntas de diseño propio — no son los ítems del FRAS original.',
  fuente: 'docs/mapa-teorico-marcos-conceptuales.md#teoría-de-resiliencia-familiar-walsh',
  formula: 'promedio',
  opciones: OPCIONES,
  nombreSubescala: NOMBRE_SUB,
  subescalas: [
    { id: 'comunicacion', nombre: 'Comunicación y resolución de problemas', items: ITEMS_COMUNICACION },
    { id: 'recursos', nombre: 'Recursos sociales y económicos', items: ITEMS_RECURSOS },
    { id: 'actitud', nombre: 'Actitud positiva', items: ITEMS_ACTITUD },
    { id: 'conexion', nombre: 'Conexión familiar', items: ITEMS_CONEXION },
    { id: 'espiritualidad', nombre: 'Espiritualidad familiar', items: ITEMS_ESPIRITUALIDAD },
    { id: 'sentido', nombre: 'Sentido de la adversidad', items: ITEMS_SENTIDO },
  ],
  reglas: [reglaResilienciaConsolidada, reglaAFortalecer, reglaInternaSinExterna, reglaExternaSinInterna, reglaMixto],
};
