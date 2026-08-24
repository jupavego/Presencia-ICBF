// Módulo de Perfilamiento Multidimensional: única fuente de verdad de las
// 13 esferas/ámbitos de vida y las herramientas propuestas para cada una.
//
// Ver docs/arquitectura-modulo-perfilamiento.md y
// docs/matriz-variables-indicadores.md para el sustento de cada fila.
//
// `objetivos` referencia por índice a OBJETIVOS_ESPECIFICOS en
// servicioInfo.js (0 = crisis familiar, 1 = capacidades de cuidado mutuo,
// 2 = proyecto de vida y redes). Es un cruce propuesto por el equipo, no
// una regla oficial del servicio — se marca así para que quede abierto a
// ajuste.
//
// Igual que en etapas.js: `componentKey` referencia un componente
// registrado en src/components/formats/registry.js. Todas las
// herramientas de este módulo están en fase de diseño (ninguna
// digitalizada aún), salvo el motor de lectura de red del F1, que ya
// existe y se reutiliza aquí en vez de duplicarse.

export const AMBITOS = [
  {
    codigo: 'A',
    nombre: 'Persona',
    objetivos: [1],
    proposito: 'Autoconocimiento de recursos internos: cómo la persona se percibe a sí misma frente al estrés, sus rasgos y su valía personal.',
    herramientas: [
      { codigo: 'AUTOEF', nombre: 'Autoeficacia General', desc: 'Qué tan capaz se siente la persona de manejar el estrés y resolver dificultades — un primer indicador de confianza personal para orientar el acompañamiento.', estado: 'disponible', componentKey: 'AUTOEF', nota: 'Instrumento real (Escala de Autoeficacia General), 10 ítems, escala 1-10.' },
      { codigo: 'ROSENBERG', nombre: 'Autoestima (Rosenberg)', desc: 'Qué tan bien se siente la persona consigo misma — insumo directo para el acompañamiento en autoconocimiento y proyecto de vida.', estado: 'disponible', componentKey: 'AUTOESTIMA', disenoPropio: true, nota: 'Preguntas propias inspiradas en la Escala de Rosenberg — la validación disponible es de población argentina, no colombiana.' },
      { codigo: 'BFI2', nombre: 'Rasgos de personalidad (BFI-2)', desc: 'Perfil de personalidad en 5 grandes rasgos (extraversión, cordialidad, responsabilidad, estabilidad emocional, apertura) — ayuda a entender el estilo relacional y de afrontamiento de la persona.', estado: 'disponible', componentKey: 'BFI2', nota: 'Instrumento real y completo (BFI-2, 60 ítems), traducción al español de licencia abierta.' },
      { codigo: 'HONHUM', nombre: 'Honestidad-Humildad', desc: 'Sinceridad, equidad y modestia en las relaciones — complementa el perfil de personalidad (BFI-2) con un rasgo que este no cubre.', estado: 'disponible', componentKey: 'HONHUM', disenoPropio: true, nota: 'Preguntas propias inspiradas en el modelo HEXACO — el instrumento de medición original requiere licencia de investigación.' },
      { codigo: 'RESIND', nombre: 'Resiliencia individual', desc: 'Capacidad de la persona para adaptarse y recuperarse ante dificultades — distinta de la resiliencia familiar (esfera C), útil para identificar recursos personales frente a la crisis.', estado: 'disponible', componentKey: 'RESIND', disenoPropio: true, nota: 'Preguntas propias inspiradas en el CD-RISC — el instrumento de medición original es de licencia comercial.' },
    ],
  },
  {
    codigo: 'B',
    nombre: 'Intereses y Potencial',
    objetivos: [2],
    proposito: 'Qué actividades, fortalezas y capacidades reconoce la persona en sí misma como punto de partida para su proyecto de vida.',
    herramientas: [
      { codigo: 'FORTVIRT', nombre: 'Fortalezas de carácter (por virtud)', desc: 'Qué fortalezas de carácter reconoce la persona en sí misma (curiosidad, valentía, humanidad, justicia, templanza, trascendencia) — recurso directo para el proyecto de vida, ayuda a nombrar capacidades ya presentes en vez de partir solo de las dificultades.', estado: 'disponible', componentKey: 'FORTVIRT', disenoPropio: true, nota: 'Preguntas propias sobre la taxonomía de Peterson & Seligman (académica y pública) — el instrumento de medición original (VIA) requiere licencia de investigación grupal.' },
      { codigo: 'RIASECHIB', nombre: 'Intereses vocacionales (tipológico)', desc: 'Afinidad con distintos tipos de interés vocacional (práctico, investigativo, artístico, social, persuasivo, organizado) — orienta la conversación sobre estudio y trabajo dentro del proyecto de vida.', estado: 'disponible', componentKey: 'RIASECHIB', disenoPropio: true, nota: 'Preguntas propias inspiradas en el modelo de Holland — el instrumento oficial (Self-Directed Search) es comercial, no reproduce sus ítems.' },
      { codigo: 'INTERES', nombre: 'Intereses y preferencias vitales', desc: 'Qué actividades disfruta la persona hoy y qué tan presentes están en su vida — complementa la exploración vocacional (RIASEC) con una mirada más abierta, no limitada a categorías fijas.', estado: 'disponible', componentKey: 'INTERES', disenoPropio: true },
      { codigo: 'APTITUD', nombre: 'Aptitudes y habilidades percibidas', desc: 'Qué habilidades reconoce la persona en sí misma y si su entorno se las reconoce también — ayuda a identificar recursos ya disponibles para apoyar el proyecto de vida.', estado: 'disponible', componentKey: 'APTITUD', disenoPropio: true },
    ],
  },
  {
    codigo: 'C',
    nombre: 'Familia',
    objetivos: [0, 1],
    proposito: 'Cómo funciona la familia como sistema: comunicación, roles, cohesión y capacidad de adaptarse ante la crisis.',
    herramientas: [
      { codigo: 'FAD', nombre: 'Funcionamiento Familiar (McMaster)', desc: 'Cómo funciona la familia como sistema en 7 áreas (resolución de problemas, comunicación, roles, respuesta afectiva, involucramiento, control de conducta, funcionamiento general) — el instrumento más completo del módulo para entender la dinámica familiar.', estado: 'disponible', componentKey: 'FAD', nota: 'Instrumento real y completo (McMaster FAD, 60 ítems).' },
      { codigo: 'FACES', nombre: 'Cohesión y Adaptabilidad (FACES-20esp)', desc: 'Cercanía emocional entre los miembros de la familia y su capacidad de adaptarse ante el cambio o el estrés — útil para identificar si la familia está muy unida o muy dispersa, muy rígida o muy caótica.', estado: 'disponible', componentKey: 'FACES20ESP', nota: 'Instrumento real (FACES-20esp, 20 ítems), basado en el modelo circumplejo de Olson.' },
      { codigo: 'FRAS', nombre: 'Resiliencia Familiar (FRAS)', desc: 'Capacidad de adaptación familiar ante la crisis.', estado: 'pendiente', componentKey: null, nota: 'No disponible como versión validada en español — ninguna fuente revisada reproduce los 54 ítems completos. El instrumento original en inglés sí se localizó completo (Sixbey, 2005) y está disponible con traducción propia en la fila FRAS-54 más abajo; la fila híbrida cubre el mismo constructo con preguntas propias.' },
      { codigo: 'FRAS_HIB', nombre: 'Resiliencia Familiar (híbrido)', desc: 'Capacidad de la familia para adaptarse y salir fortalecida de situaciones difíciles, en 6 dimensiones (comunicación, recursos, actitud, conexión, espiritualidad, sentido de la adversidad).', estado: 'disponible', componentKey: 'FRAS_HIB', disenoPropio: true, nota: 'Preguntas propias sobre el modelo de resiliencia familiar de Walsh — no reproduce los ítems del FRAS original.' },
      { codigo: 'FRAS_REAL', nombre: 'Resiliencia Familiar (FRAS-54, ítems reales)', desc: 'La misma exploración de resiliencia familiar en 6 factores, con los 54 ítems reales del Family Resilience Assessment Scale (Sixbey, 2005) en vez de preguntas propias — para cuando se prefiere trabajar sobre el instrumento original.', estado: 'disponible', componentKey: 'FRAS_REAL', nota: 'Instrumento real — traducción propia del inglés (disertación de Sixbey, publicada abiertamente por la Universidad de Florida), no una adaptación validada al español. Complementa a la fila híbrida, no la reemplaza.' },
      { codigo: 'FQOL', nombre: 'Calidad de Vida Familiar (FQOL)', desc: 'Satisfacción de la familia con su día a día: interacción familiar, crianza, y bienestar emocional/físico/material — panorama general de cómo la familia vive su cotidianidad.', estado: 'disponible', componentKey: 'FQOL', nota: 'Instrumento real (FQOL Scale, Beach Center on Disability), con una subescala adicional que solo aplica si algún integrante de la familia tiene discapacidad.' },
      { codigo: 'EMPOFAM', nombre: 'Empoderamiento familiar', desc: 'Qué tanto siente la familia que puede resolver sus propios problemas, saber a quién acudir y participar en las decisiones que la afectan — conecta directamente con el objetivo de fortalecer la autonomía familiar.', estado: 'disponible', componentKey: 'EMPOFAM', disenoPropio: true, nota: 'Preguntas propias inspiradas en la Family Empowerment Scale — el instrumento original tiene derechos de autor sin términos de uso libre.' },
    ],
  },
  {
    codigo: 'D',
    nombre: 'Relaciones',
    objetivos: [0],
    proposito: 'Con quién cuenta la persona: apoyo social percibido y composición de su red de vínculos.',
    herramientas: [
      { codigo: 'MSPSS', nombre: 'Apoyo Social Percibido (MSPSS)', desc: 'Qué tanto apoyo siente la persona que tiene disponible — de su familia, de sus amigos, o de alguien más significativo — para identificar si cuenta con red de apoyo o si esta es un punto a fortalecer.', estado: 'disponible', componentKey: 'MSPSS', nota: 'Instrumento real (MSPSS, 12 ítems), traducción propia.' },
      { codigo: 'F1', nombre: 'Mapa de Pertenencia (motor de lectura de red)', desc: 'Mapa visual de la red de vínculos de la persona: con quién cuenta, en qué ámbitos de su vida y qué tan cerca los siente.', estado: 'disponible', componentKey: 'F1', nota: 'Mismo formato F1 de la etapa de Acompañamiento (etapa 03) — se reutiliza aquí, no se vuelve a diligenciar.' },
    ],
  },
  {
    codigo: 'E',
    nombre: 'Crianza y Cuidado',
    objetivos: [1],
    proposito: 'Prácticas de crianza y cuidado dentro del hogar.',
    herramientas: [
      { codigo: 'CRIANZAHIB', nombre: 'Prácticas de crianza', desc: 'Cómo la familia ejerce la crianza: participación positiva, supervisión, disciplina, consistencia de las normas, y uso de castigo físico — insumo directo para el acompañamiento en pautas de crianza.', estado: 'disponible', componentKey: 'CRIANZA', disenoPropio: true, nota: 'Preguntas propias sobre las dimensiones del Alabama Parenting Questionnaire (APQ) — su licencia exige no modificar la redacción original, por lo que tampoco es traducible sin autorización.' },
    ],
  },
  {
    codigo: 'F',
    nombre: 'Redes',
    objetivos: [1, 2],
    proposito: 'Redes de apoyo natural e institucional que rodean a la familia.',
    herramientas: [
      { codigo: 'MSPSS-F', nombre: 'Apoyo Social Percibido (MSPSS)', desc: 'Qué tanto apoyo institucional y comunitario (no solo personal) siente disponible la familia.', estado: 'disponible', componentKey: 'MSPSS', nota: 'Mismo instrumento que en la esfera D — no se vuelve a diligenciar por separado.' },
      { codigo: 'F1-F', nombre: 'Mapa de Pertenencia (motor de lectura de red)', desc: 'Qué tan diversa es la red de la familia entre ámbitos natural (familia, amigos) e institucional (servicios, organizaciones).', estado: 'disponible', componentKey: 'F1', nota: 'Mismo instrumento que en la esfera D — no se vuelve a diligenciar por separado.' },
    ],
  },
  {
    codigo: 'G',
    nombre: 'Bienestar',
    objetivos: [0, 1],
    proposito: 'Estado anímico reciente y calidad de vida percibida en sus distintos dominios.',
    herramientas: [
      { codigo: 'WHO5', nombre: 'Bienestar Subjetivo (WHO-5)', desc: 'Estado de ánimo general de la persona en las últimas dos semanas — instrumento breve de tamizaje, útil para detectar si conviene profundizar en salud mental.', estado: 'disponible', componentKey: 'WHO5', nota: 'Instrumento real y oficial (WHO-5), de uso abierto, con el punto de corte clínico del propio manual de la OMS.' },
      { codigo: 'CVIDAHIB', nombre: 'Calidad de vida por dominios', desc: 'Satisfacción de la persona con su vida en 4 dominios: físico, psicológico, relaciones sociales y entorno.', estado: 'disponible', componentKey: 'CVIDAHIB', disenoPropio: true, nota: 'Preguntas propias sobre la estructura del WHOQOL-BREF — ese instrumento requiere permiso explícito de la OMS para su uso.' },
    ],
  },
  {
    codigo: 'H',
    nombre: 'Educación',
    objetivos: [2],
    proposito: 'Trayectoria educativa, motivación y barreras de acceso o permanencia.',
    herramientas: [
      { codigo: 'EDU', nombre: 'Exploración educativa', desc: 'Trayectoria escolar de la persona, qué tan importante considera la educación, y qué le ha dificultado estudiar o continuar estudiando.', estado: 'disponible', componentKey: 'EDU', disenoPropio: true },
    ],
  },
  {
    codigo: 'I',
    nombre: 'Ámbito Ocupacional',
    objetivos: [2],
    proposito: 'Trayectoria laboral u ocupacional, situación actual y barreras de acceso.',
    herramientas: [
      { codigo: 'OCUP', nombre: 'Exploración ocupacional', desc: 'Trayectoria laboral u ocupacional de la persona, su situación actual, y las barreras que ha enfrentado para conseguir o mantener un trabajo.', estado: 'disponible', componentKey: 'OCUP', disenoPropio: true },
    ],
  },
  {
    codigo: 'J',
    nombre: 'Socioeconómica',
    objetivos: [1, 2],
    proposito: 'Condiciones materiales y de ingreso del hogar (marco CSDH).',
    herramientas: [
      { codigo: 'SOCIOECO', nombre: 'Caracterización socioeconómica', desc: 'Condiciones materiales del hogar: ingreso, ocupación, vivienda y acceso a servicios básicos — contexto necesario para entender la situación completa de la familia.', estado: 'disponible', componentKey: 'SOCIOECO', disenoPropio: true, nota: 'Preguntas propias, basadas en el marco de determinantes sociales de la salud (CSDH-OMS).' },
    ],
  },
  {
    codigo: 'K',
    nombre: 'Cultural',
    objetivos: [1, 2],
    proposito: 'Identidad, prácticas y participación cultural de la persona y su familia.',
    herramientas: [
      { codigo: 'CULTURAL', nombre: 'Exploración cultural e identitaria', desc: 'Identidad cultural o étnica de la persona y su familia, sus tradiciones, y su participación en espacios culturales o comunitarios.', estado: 'disponible', componentKey: 'CULTURAL', disenoPropio: true },
    ],
  },
  {
    codigo: 'L',
    nombre: 'Territorial y Comunitaria',
    objetivos: [1, 2],
    proposito: 'Contexto territorial: seguridad percibida, oferta institucional y vínculo con la comunidad.',
    herramientas: [
      { codigo: 'TERRITORIO', nombre: 'Exploración territorial y comunitaria', desc: 'Cómo percibe la familia su territorio: seguridad, oferta institucional disponible, y su relación con la comunidad.', estado: 'disponible', componentKey: 'TERRITORIO', disenoPropio: true, nota: 'Preguntas propias, basadas en el marco de determinantes sociales de la salud (CSDH-OMS).' },
    ],
  },
  {
    codigo: 'M',
    nombre: 'Proyecto de Vida',
    objetivos: [2],
    proposito: 'Integra fortalezas, recursos, contexto, intereses, actitudes, valores, aspiraciones, oportunidades y barreras en una sola lectura orientadora.',
    herramientas: [
      { codigo: 'PROYVIDA', nombre: 'Exploración de proyecto de vida', desc: 'Intereses, aptitudes, valores, aspiraciones y las oportunidades o barreras que la persona percibe para lograrlas — integra en una sola lectura lo ya explorado en fortalezas (esfera B), autoeficacia (A), redes (D/F) y contexto (J/L) para orientar el proyecto de vida.', estado: 'disponible', componentKey: 'PROYVIDA', disenoPropio: true },
    ],
  },
];

export function countHerramientas(ambito) {
  return ambito.herramientas.length;
}

export function countDisponiblesAmbito(ambito) {
  return ambito.herramientas.filter((h) => h.estado === 'disponible').length;
}
