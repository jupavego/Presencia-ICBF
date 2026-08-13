// Exploración territorial y comunitaria — diseño propio del equipo sobre
// el marco CSDH, esfera L. Territorial y Comunitaria.
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#l-territorial-y-comunitaria.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Exploración territorial y comunitaria.

const PREGUNTAS = [
  {
    id: 'seguridad',
    texto: '¿Qué tan seguro/a se siente en el barrio o vereda donde vive?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'poco', etiqueta: 'Poco seguro/a', nivel: 'bajo' },
      { valor: 'medio', etiqueta: 'Medianamente seguro/a', nivel: 'medio' },
      { valor: 'mucho', etiqueta: 'Muy seguro/a', nivel: 'alto' },
    ],
  },
  {
    id: 'oferta_institucional',
    texto: '¿Qué instituciones, programas u organizaciones conoce o ha usado en su territorio?',
    tipo: 'checklist',
    opciones: [
      { valor: 'salud', etiqueta: 'Salud' },
      { valor: 'educacion', etiqueta: 'Educación' },
      { valor: 'icbf', etiqueta: 'ICBF/protección' },
      { valor: 'organizaciones', etiqueta: 'Organizaciones comunitarias' },
      { valor: 'ninguna', etiqueta: 'Ninguna' },
    ],
  },
  {
    id: 'vinculo_comunitario',
    texto: '¿Cómo describiría la relación de su familia con la comunidad o el vecindario?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'distante', etiqueta: 'Distante', nivel: 'bajo' },
      { valor: 'cordial', etiqueta: 'Cordial pero poco cercana', nivel: 'medio' },
      { valor: 'cercana', etiqueta: 'Cercana/de apoyo mutuo', nivel: 'alto' },
    ],
  },
  {
    id: 'necesidades_territorio',
    texto: '¿Qué necesidades del territorio afectan directamente a su familia?',
    tipo: 'checklist',
    opciones: [
      { valor: 'movilidad', etiqueta: 'Movilidad/transporte' },
      { valor: 'servicios', etiqueta: 'Servicios básicos' },
      { valor: 'seguridad', etiqueta: 'Seguridad' },
      { valor: 'oferta', etiqueta: 'Oferta institucional' },
      { valor: 'ninguna', etiqueta: 'Ninguna' },
    ],
  },
  {
    id: 'participacion',
    texto: '¿Participa o le gustaría participar en espacios comunitarios —juntas, redes, organizaciones?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'ya_participa', etiqueta: 'Ya participa', nivel: 'alto' },
      { valor: 'le_gustaria', etiqueta: 'Le gustaría participar', nivel: 'medio' },
      { valor: 'no_interesa', etiqueta: 'No le interesa', nivel: 'bajo' },
    ],
  },
];

function reglaAislamientoCompuesto({ categorias }) {
  if (categorias.seguridad.nivel !== 'bajo') return null;
  if (categorias.vinculo_comunitario.nivel !== 'bajo') return null;
  return {
    codigo: 'TERRITORIAL_AISLAMIENTO_COMPUESTO',
    nivel: 'profundizacion',
    titulo: 'Aislamiento territorial compuesto',
    evidencia: [`Seguridad percibida: ${categorias.seguridad.etiqueta}`, `Vínculo comunitario: ${categorias.vinculo_comunitario.etiqueta}`],
    lectura: 'Ni el entorno se percibe seguro ni hay tejido comunitario de apoyo cercano — relevante directamente para el objetivo 3 del servicio (redes de cuidado).',
    preguntas: ['¿Qué ayudaría a que la familia se sintiera más segura o conectada en su territorio?'],
    riesgos: ['La combinación de baja seguridad percibida y bajo vínculo comunitario es un factor relevante para la priorización del caso.'],
  };
}

function reglaParticipacionPeseABarreras({ categorias }) {
  const necesidadesMarcadas = categorias.necesidades_territorio.filter((c) => c.valor !== 'ninguna').length;
  if (necesidadesMarcadas < 2) return null;
  if (categorias.participacion.valor !== 'ya_participa') return null;
  return {
    codigo: 'TERRITORIAL_PARTICIPACION_PESE_BARRERAS',
    nivel: 'fortaleza',
    titulo: 'Participación activa pese a barreras estructurales',
    evidencia: [`Necesidades territoriales: ${categorias.necesidades_territorio.filter((c) => c.valor !== 'ninguna').map((c) => c.etiqueta).join(', ')}`, 'Ya participa en espacios comunitarios'],
    lectura: 'Se identifica una fortaleza de participación activa a pesar de las barreras estructurales del territorio — vale la pena reconocerla explícitamente, no solo registrar las barreras.',
    preguntas: ['¿Qué le ha motivado a participar a pesar de estas dificultades del territorio?'],
    estrategias: ['Reconocer y visibilizar esta participación como un recurso comunitario de la familia.'],
  };
}

// Exhaustivo: cubre lo que las 2 reglas anteriores no capturan.
function reglaExploracionAbierta({ categorias }) {
  const aislamiento = categorias.seguridad.nivel === 'bajo' && categorias.vinculo_comunitario.nivel === 'bajo';
  const necesidadesMarcadas = categorias.necesidades_territorio.filter((c) => c.valor !== 'ninguna').length;
  const participacionPeseBarreras = necesidadesMarcadas >= 2 && categorias.participacion.valor === 'ya_participa';
  if (aislamiento || participacionPeseBarreras) return null;
  return {
    codigo: 'TERRITORIAL_EXPLORACION_ABIERTA',
    nivel: 'oportunidad',
    titulo: 'Dimensión territorial para seguir explorando',
    evidencia: [
      `Seguridad percibida: ${categorias.seguridad.etiqueta}`,
      `Vínculo comunitario: ${categorias.vinculo_comunitario.etiqueta}`,
      `Participación: ${categorias.participacion.etiqueta}`,
    ],
    lectura: 'Las respuestas no muestran un patrón marcado de aislamiento ni de participación activa pese a barreras — vale la pena explorar más en la conversación.',
    preguntas: ['¿Qué le gustaría que cambiara en su relación con el territorio o la comunidad?'],
  };
}

export const EXPLORACION_TERRITORIAL = {
  id: 'TERRITORIO',
  nombre: 'Exploración Territorial y Comunitaria',
  descripcion: 'Seguridad percibida, oferta institucional del territorio y relación con la comunidad. Preguntas propias sobre el marco conceptual CSDH.',
  fuente: 'docs/matriz-variables-indicadores.md#l-territorial-y-comunitaria',
  preguntas: PREGUNTAS,
  reglas: [reglaAislamientoCompuesto, reglaParticipacionPeseABarreras, reglaExploracionAbierta],
};
