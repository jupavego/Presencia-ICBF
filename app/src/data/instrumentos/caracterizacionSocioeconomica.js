// Caracterización socioeconómica — diseño propio del equipo sobre el marco
// CSDH (Solar & Irwin, OMS), esfera J. Socioeconómica. El marco da la
// estructura conceptual (determinantes estructurales e intermediarios)
// pero no preguntas ya hechas — se diseñan aquí.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#j-socioeconómica.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Caracterización socioeconómica.

const PREGUNTAS = [
  {
    id: 'fuente_ingreso',
    texto: '¿Cuál es la principal fuente de ingresos del hogar?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'formal', etiqueta: 'Empleo formal' },
      { valor: 'informal', etiqueta: 'Trabajo informal' },
      { valor: 'ayuda_familiar', etiqueta: 'Ayuda familiar' },
      { valor: 'subsidio', etiqueta: 'Subsidio/ayuda estatal' },
      { valor: 'sin_fijo', etiqueta: 'Sin ingreso fijo' },
    ],
  },
  {
    id: 'alcance_ingreso',
    texto: '¿El ingreso del hogar alcanza para cubrir las necesidades básicas del mes?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'no_alcanza', etiqueta: 'No alcanza' },
      { valor: 'justo', etiqueta: 'Alcanza justo' },
      { valor: 'holgura', etiqueta: 'Alcanza con holgura' },
    ],
  },
  {
    id: 'dependientes',
    texto: '¿Cuántas personas dependen económicamente de ese ingreso?',
    tipo: 'numerico',
  },
  {
    id: 'tipo_vivienda',
    texto: '¿La vivienda donde reside es propia, arrendada, prestada u otra condición?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'propia', etiqueta: 'Propia' },
      { valor: 'arrendada', etiqueta: 'Arrendada' },
      { valor: 'prestada', etiqueta: 'Prestada/Familiar' },
      { valor: 'otra', etiqueta: 'Otra' },
    ],
  },
  {
    id: 'servicios_basicos',
    texto: '¿Cuenta con acceso a servicios básicos —agua, energía, saneamiento?',
    tipo: 'checklist',
    opciones: [
      { valor: 'agua', etiqueta: 'Agua' },
      { valor: 'energia', etiqueta: 'Energía' },
      { valor: 'saneamiento', etiqueta: 'Saneamiento' },
    ],
  },
];

function reglaVulnerabilidadCompuesta({ categorias }) {
  if (categorias.alcance_ingreso.valor !== 'no_alcanza') return null;
  const faltantes = 3 - categorias.servicios_basicos.length;
  if (faltantes < 1) return null;
  return {
    codigo: 'SOCIOECO_VULNERABILIDAD_COMPUESTA',
    nivel: 'profundizacion',
    titulo: 'Vulnerabilidad material compuesta',
    evidencia: [`Alcance del ingreso: ${categorias.alcance_ingreso.etiqueta}`, `Servicios básicos con acceso: ${categorias.servicios_basicos.map((c) => c.etiqueta).join(', ') || 'ninguno'}`],
    lectura: 'La combinación de ingreso insuficiente y falta de acceso a servicios básicos describe una situación más específica que cualquiera de los dos indicadores por separado.',
    preguntas: ['¿Cuál de estas carencias afecta más el día a día de la familia?'],
    riesgos: ['La combinación de ingreso insuficiente y servicios básicos incompletos es un factor relevante para la priorización del caso.'],
  };
}

function reglaIngresoAContextualizar({ categorias, respuestas }) {
  if (categorias.alcance_ingreso.valor !== 'holgura') return null;
  const dependientes = respuestas.dependientes;
  if (dependientes === undefined || dependientes < 4) return null;
  return {
    codigo: 'SOCIOECO_INGRESO_A_CONTEXTUALIZAR',
    nivel: 'oportunidad',
    titulo: 'Ingreso a contextualizar según dependientes',
    evidencia: [`Alcance del ingreso: ${categorias.alcance_ingreso.etiqueta}`, `Personas dependientes: ${dependientes}`],
    lectura: 'El nivel de ingreso reportado se lee junto con cuántas personas dependen de él, no de forma aislada — con varios dependientes, la holgura percibida puede ser más ajustada de lo que parece.',
    preguntas: ['¿Cómo se distribuye ese ingreso entre las necesidades de todos los dependientes?'],
  };
}

function reglaServiciosCompletosIngresoSuficiente({ categorias }) {
  if (categorias.alcance_ingreso.valor === 'no_alcanza') return null;
  if (categorias.servicios_basicos.length < 3) return null;
  return {
    codigo: 'SOCIOECO_ESTABLE',
    nivel: 'fortaleza',
    titulo: 'Condiciones materiales básicas cubiertas',
    evidencia: [`Alcance del ingreso: ${categorias.alcance_ingreso.etiqueta}`, 'Acceso a los 3 servicios básicos'],
    lectura: 'El hogar reporta acceso a los servicios básicos y un ingreso que alcanza para cubrir las necesidades del mes.',
  };
}

export const CARACTERIZACION_SOCIOECONOMICA = {
  id: 'SOCIOECO',
  nombre: 'Caracterización Socioeconómica',
  descripcion: 'Ingreso, ocupación, vivienda y acceso a servicios básicos del hogar. Preguntas propias sobre el marco conceptual CSDH.',
  fuente: 'docs/matriz-variables-indicadores.md#j-socioeconómica',
  preguntas: PREGUNTAS,
  reglas: [reglaVulnerabilidadCompuesta, reglaIngresoAContextualizar, reglaServiciosCompletosIngresoSuficiente],
};
