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
      { codigo: 'AUTOEF', nombre: 'Autoeficacia General', desc: 'Confianza percibida para manejar situaciones estresantes.', estado: 'disponible', componentKey: 'AUTOEF', nota: 'Cuarta herramienta funcional del módulo.' },
      { codigo: 'ROSENBERG', nombre: 'Autoestima (Rosenberg)', desc: 'Valía personal percibida.', estado: 'disponible', componentKey: 'AUTOESTIMA', disenoPropio: true, nota: 'Híbrido — validación disponible es argentina, no colombiana; preguntas propias sobre el mismo constructo.' },
      { codigo: 'BFI2', nombre: 'Rasgos de personalidad (BFI-2)', desc: 'Cinco Grandes: Extraversión, Cordialidad, Responsabilidad, Emocionalidad negativa, Apertura.', estado: 'pendiente', componentKey: null },
      { codigo: 'HONHUM', nombre: 'Honestidad-Humildad', desc: 'Sinceridad, equidad, evitación de la avaricia, modestia — la aportación de HEXACO que el BFI-2 no cubre.', estado: 'disponible', componentKey: 'HONHUM', disenoPropio: true, nota: 'Híbrido — HEXACO-PI-R-60 completo queda bloqueado por licencia de investigación; preguntas propias sobre el mismo constructo.' },
      { codigo: 'RESIND', nombre: 'Resiliencia individual', desc: 'Capacidad de adaptación personal ante la adversidad, distinta de la resiliencia familiar (esfera C).', estado: 'disponible', componentKey: 'RESIND', disenoPropio: true, nota: 'Híbrido — CD-RISC es comercial; preguntas propias sobre el mismo constructo.' },
    ],
  },
  {
    codigo: 'B',
    nombre: 'Intereses y Potencial',
    objetivos: [2],
    proposito: 'Qué actividades, fortalezas y capacidades reconoce la persona en sí misma como punto de partida para su proyecto de vida.',
    herramientas: [
      { codigo: 'FORTVIRT', nombre: 'Fortalezas de carácter (por virtud)', desc: 'Fortalezas que la persona reconoce en sí misma, agrupadas en 6 virtudes (Sabiduría, Coraje, Humanidad, Justicia, Templanza, Trascendencia).', estado: 'disponible', componentKey: 'FORTVIRT', disenoPropio: true, nota: 'Híbrido — VIA GACS-24/SSS quedan bloqueados por licencia de investigación grupal; la taxonomía de Peterson & Seligman es académica pública.' },
      { codigo: 'RIASECHIB', nombre: 'Intereses vocacionales (tipológico)', desc: 'Afinidad descriptiva con los 6 tipos de Holland: Realista, Investigador, Artístico, Social, Emprendedor, Convencional.', estado: 'disponible', componentKey: 'RIASECHIB', disenoPropio: true, nota: 'Híbrido — el Self-Directed Search oficial es comercial; no reproduce sus ítems ni genera un código de 3 letras validado.' },
      { codigo: 'INTERES', nombre: 'Intereses y preferencias vitales', desc: 'Exploración cualitativa de actividades y temas significativos (no tipológica).', estado: 'pendiente', componentKey: null, disenoPropio: true },
      { codigo: 'APTITUD', nombre: 'Aptitudes y habilidades percibidas', desc: 'Capacidades que la persona reconoce en sí misma o que su entorno le reconoce.', estado: 'pendiente', componentKey: null, disenoPropio: true },
    ],
  },
  {
    codigo: 'C',
    nombre: 'Familia',
    objetivos: [0, 1],
    proposito: 'Cómo funciona la familia como sistema: comunicación, roles, cohesión y capacidad de adaptarse ante la crisis.',
    herramientas: [
      { codigo: 'FAD', nombre: 'Funcionamiento Familiar (McMaster)', desc: 'Desempeño familiar en 7 subescalas: resolución de problemas, comunicación, roles, respuesta afectiva, involucramiento afectivo, control de conducta, funcionamiento general.', estado: 'disponible', componentKey: 'FAD', nota: 'Sexta herramienta funcional del módulo — la más grande (60 ítems), primera con ítems invertidos reales.' },
      { codigo: 'FACES', nombre: 'Cohesión y Adaptabilidad (FACES-20esp)', desc: 'Cercanía emocional y capacidad de cambio ante el estrés.', estado: 'disponible', componentKey: 'FACES20ESP', nota: 'Tercera herramienta funcional del módulo — usa el modelo curvilíneo real de Olson.' },
      { codigo: 'FRAS', nombre: 'Resiliencia Familiar (FRAS)', desc: 'Capacidad de adaptación familiar ante la crisis.', estado: 'pendiente', componentKey: null, nota: 'Bloqueado — el paper de adaptación colombiana no reproduce los 54 ítems completos (ver fila híbrida).' },
      { codigo: 'FRAS_HIB', nombre: 'Resiliencia Familiar (híbrido)', desc: 'Mismas 6 dimensiones del modelo de Walsh (comunicación, recursos, actitud, conexión, espiritualidad, sentido de la adversidad), con preguntas de diseño propio.', estado: 'disponible', componentKey: 'FRAS_HIB', disenoPropio: true, nota: 'Séptima herramienta funcional del módulo — sustituye al FRAS bloqueado.' },
      { codigo: 'FQOL', nombre: 'Calidad de Vida Familiar (FQOL)', desc: 'Satisfacción con interacción familiar, crianza, bienestar emocional/físico/material.', estado: 'disponible', componentKey: 'FQOL', nota: 'Quinta herramienta funcional del módulo — primera con subescala condicional.' },
      { codigo: 'EMPOFAM', nombre: 'Empoderamiento familiar', desc: 'Confianza para resolver problemas, saber a quién acudir, participar en decisiones que la afectan.', estado: 'disponible', componentKey: 'EMPOFAM', disenoPropio: true, nota: 'Primera herramienta funcional con el motor cualitativo — híbrido, Family Empowerment Scale tiene copyright sin términos de uso libre.' },
    ],
  },
  {
    codigo: 'D',
    nombre: 'Relaciones',
    objetivos: [0],
    proposito: 'Con quién cuenta la persona: apoyo social percibido y composición de su red de vínculos.',
    herramientas: [
      { codigo: 'MSPSS', nombre: 'Apoyo Social Percibido (MSPSS)', desc: 'Percepción de disponibilidad de apoyo desde familia, amigos y otro significativo.', estado: 'disponible', componentKey: 'MSPSS', nota: 'Segunda herramienta funcional del módulo — prueba la variante multiescala del motor genérico.' },
      { codigo: 'F1', nombre: 'Mapa de Pertenencia (motor de lectura de red)', desc: 'Diversidad, proximidad y naturaleza de la red de vínculos.', estado: 'disponible', componentKey: 'F1', nota: 'Ya digitalizado — se reutiliza el F1 de la Etapa 03, no se duplica.' },
    ],
  },
  {
    codigo: 'E',
    nombre: 'Crianza y Cuidado',
    objetivos: [1],
    proposito: 'Prácticas de crianza y cuidado dentro del hogar.',
    herramientas: [
      { codigo: 'CRIANZAHIB', nombre: 'Prácticas de crianza', desc: 'Involucramiento positivo, supervisión, disciplina, consistencia, castigo físico.', estado: 'disponible', componentKey: 'CRIANZA', disenoPropio: true, nota: 'Híbrido — el APQ original exige no modificar su redacción, así que ni traducirlo es viable sin autorización; preguntas propias en español sobre las mismas 5 dimensiones.' },
    ],
  },
  {
    codigo: 'F',
    nombre: 'Redes',
    objetivos: [1, 2],
    proposito: 'Redes de apoyo natural e institucional que rodean a la familia.',
    herramientas: [
      { codigo: 'MSPSS-F', nombre: 'Apoyo Social Percibido (MSPSS)', desc: 'Compartido con la esfera D.', estado: 'disponible', componentKey: 'MSPSS', nota: 'Ver esfera D — mismo instrumento, ya digitalizado.' },
      { codigo: 'F1-F', nombre: 'Mapa de Pertenencia (motor de lectura de red)', desc: 'Diversidad de ámbitos, proximidad, concentración, naturaleza natural/institucional de la red.', estado: 'disponible', componentKey: 'F1', nota: 'Ver esfera D — mismo instrumento, ya digitalizado.' },
    ],
  },
  {
    codigo: 'G',
    nombre: 'Bienestar',
    objetivos: [0, 1],
    proposito: 'Estado anímico reciente y calidad de vida percibida en sus distintos dominios.',
    herramientas: [
      { codigo: 'WHO5', nombre: 'Bienestar Subjetivo (WHO-5)', desc: 'Estado anímico de las últimas 2 semanas.', estado: 'disponible', componentKey: 'WHO5', nota: 'Primera herramienta funcional del módulo — motor genérico + reglas de interacción ya implementados.' },
      { codigo: 'CVIDAHIB', nombre: 'Calidad de vida por dominios', desc: 'Satisfacción percibida en los dominios físico, psicológico, relaciones sociales y entorno.', estado: 'disponible', componentKey: 'CVIDAHIB', disenoPropio: true, nota: 'Híbrido — WHOQOL-BREF exige permiso de la OMS ("bajo ninguna circunstancia debe usarse sin permiso"); mismos 4 dominios, preguntas propias.' },
    ],
  },
  {
    codigo: 'H',
    nombre: 'Educación',
    objetivos: [2],
    proposito: 'Trayectoria educativa, motivación y barreras de acceso o permanencia.',
    herramientas: [
      { codigo: 'EDU', nombre: 'Exploración educativa', desc: 'Trayectoria escolar, motivación y barreras de acceso o permanencia.', estado: 'disponible', componentKey: 'EDU', disenoPropio: true },
    ],
  },
  {
    codigo: 'I',
    nombre: 'Ámbito Ocupacional',
    objetivos: [2],
    proposito: 'Trayectoria laboral u ocupacional, situación actual y barreras de acceso.',
    herramientas: [
      { codigo: 'OCUP', nombre: 'Exploración ocupacional', desc: 'Trayectoria laboral, situación actual y barreras de acceso o permanencia.', estado: 'disponible', componentKey: 'OCUP', disenoPropio: true },
    ],
  },
  {
    codigo: 'J',
    nombre: 'Socioeconómica',
    objetivos: [1, 2],
    proposito: 'Condiciones materiales y de ingreso del hogar (marco CSDH).',
    herramientas: [
      { codigo: 'SOCIOECO', nombre: 'Caracterización socioeconómica', desc: 'Ingreso, ocupación, vivienda y acceso a servicios básicos del hogar.', estado: 'disponible', componentKey: 'SOCIOECO', disenoPropio: true, nota: 'Preguntas propias sobre el marco conceptual CSDH.' },
    ],
  },
  {
    codigo: 'K',
    nombre: 'Cultural',
    objetivos: [1, 2],
    proposito: 'Identidad, prácticas y participación cultural de la persona y su familia.',
    herramientas: [
      { codigo: 'CULTURAL', nombre: 'Exploración cultural e identitaria', desc: 'Identidad, prácticas, tradiciones y participación cultural o comunitaria.', estado: 'disponible', componentKey: 'CULTURAL', disenoPropio: true },
    ],
  },
  {
    codigo: 'L',
    nombre: 'Territorial y Comunitaria',
    objetivos: [1, 2],
    proposito: 'Contexto territorial: seguridad percibida, oferta institucional y vínculo con la comunidad.',
    herramientas: [
      { codigo: 'TERRITORIO', nombre: 'Exploración territorial y comunitaria', desc: 'Seguridad percibida, oferta institucional del territorio y relación con la comunidad.', estado: 'disponible', componentKey: 'TERRITORIO', disenoPropio: true, nota: 'Preguntas propias sobre el marco conceptual CSDH.' },
    ],
  },
  {
    codigo: 'M',
    nombre: 'Proyecto de Vida',
    objetivos: [2],
    proposito: 'Integra fortalezas, recursos, contexto, intereses, actitudes, valores, aspiraciones, oportunidades y barreras en una sola lectura orientadora.',
    herramientas: [
      { codigo: 'PROYVIDA', nombre: 'Exploración de proyecto de vida', desc: 'Intereses, aptitudes, actitudes, valores, aspiraciones y oportunidades/barreras percibidas; integra fortalezas (esfera B), autoeficacia (A), redes (D/F) y contexto (J/L) ya explorados.', estado: 'disponible', componentKey: 'PROYVIDA', disenoPropio: true },
    ],
  },
];

export function countHerramientas(ambito) {
  return ambito.herramientas.length;
}

export function countDisponiblesAmbito(ambito) {
  return ambito.herramientas.filter((h) => h.estado === 'disponible').length;
}
