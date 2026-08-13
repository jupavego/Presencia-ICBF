// Empoderamiento familiar — híbrido inspirado en la Family Empowerment
// Scale (Regional Research Institute, Portland State University), esfera
// C. Familia.
//
// Por qué es híbrido: el instrumento original tiene copyright del Regional
// Research Institute sin términos de uso libre confirmados (ver
// docs/catalogo-instrumentos-psicosociales.md). Se conserva el constructo
// (percepción de la familia sobre su propia capacidad de gestión y
// decisión) — coincide directamente con el objetivo 2 del servicio y con
// el lenguaje de "empoderamiento" ya usado en `servicioInfo.js` — y se
// redactan preguntas propias. Primera herramienta construida con el motor
// cualitativo (`leerCategorias`, motorInstrumento.js).
//
// Preguntas y categorías: docs/matriz-variables-indicadores.md#c-familia.
// Reglas de interacción: docs/reglas-puntuacion-interpretacion.md, sección
// Empoderamiento familiar.

const PREGUNTAS = [
  {
    id: 'capacidad_percibida',
    texto: '¿Qué tan capaz se siente su familia de resolver los problemas que se le presentan?',
    tipo: 'seleccion_unica',
    opciones: [
      { valor: 'poco', etiqueta: 'Poco capaz', nivel: 'bajo' },
      { valor: 'medio', etiqueta: 'Medianamente capaz', nivel: 'medio' },
      { valor: 'mucho', etiqueta: 'Muy capaz', nivel: 'alto' },
    ],
  },
  {
    id: 'ruta_gestion',
    texto: 'Cuando su familia necesita algo, ¿sabe a quién acudir o qué pasos seguir?',
    tipo: 'presencia',
    opciones: [
      { valor: 'no', etiqueta: 'No', nivel: 'bajo' },
      { valor: 'parcial', etiqueta: 'Parcialmente', nivel: 'medio' },
      { valor: 'si', etiqueta: 'Sí', nivel: 'alto' },
    ],
  },
  {
    id: 'participacion',
    texto: '¿Su familia participa en las decisiones que la afectan, en el hogar o fuera de él?',
    tipo: 'frecuencia',
    opciones: [
      { valor: 'nunca', etiqueta: 'Nunca', nivel: 'bajo' },
      { valor: 'a_veces', etiqueta: 'A veces', nivel: 'medio' },
      { valor: 'frecuentemente', etiqueta: 'Frecuentemente', nivel: 'alto' },
      { valor: 'siempre', etiqueta: 'Siempre', nivel: 'alto' },
    ],
  },
  {
    id: 'agencia_percibida',
    texto: '¿Qué tanto siente que su familia puede influir en su propia situación, más allá de depender de otros?',
    tipo: 'frecuencia',
    opciones: [
      { valor: 'nunca', etiqueta: 'Nunca', nivel: 'bajo' },
      { valor: 'a_veces', etiqueta: 'A veces', nivel: 'medio' },
      { valor: 'frecuentemente', etiqueta: 'Frecuentemente', nivel: 'alto' },
      { valor: 'siempre', etiqueta: 'Siempre', nivel: 'alto' },
    ],
  },
];

const NOMBRE_PREGUNTA = {
  capacidad_percibida: 'Capacidad percibida para resolver problemas',
  ruta_gestion: 'Ruta de gestión conocida',
  participacion: 'Participación en decisiones',
  agencia_percibida: 'Agencia percibida sobre su situación',
};

function reglaConsolidado({ categorias }) {
  const claves = Object.keys(categorias);
  if (!claves.every((k) => categorias[k].nivel === 'alto')) return null;
  return {
    codigo: 'EMPOFAM_CONSOLIDADO',
    nivel: 'fortaleza',
    titulo: 'Empoderamiento familiar consolidado',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Las cuatro dimensiones evaluadas muestran una percepción de empoderamiento familiar sólida.',
    preguntas: ['¿Qué le ha ayudado a la familia a sentirse así de capaz?'],
    estrategias: ['Reconocer explícitamente este resultado con la familia como una fortaleza a mantener.'],
  };
}

function reglaAFortalecer({ categorias }) {
  const claves = Object.keys(categorias);
  if (!claves.every((k) => categorias[k].nivel === 'bajo')) return null;
  return {
    codigo: 'EMPOFAM_A_FORTALECER',
    nivel: 'profundizacion',
    titulo: 'Empoderamiento familiar a fortalecer',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: 'Se identifican oportunidades de fortalecimiento en las cuatro dimensiones evaluadas de empoderamiento familiar.',
    preguntas: ['¿Qué sería lo primero que ayudaría a la familia a sentirse con más control sobre su situación?'],
    estrategias: ['Revisar con el equipo si el caso cumple criterios de priorización del servicio antes de definir el plan de acompañamiento.'],
  };
}

function reglaConfianzaSinRuta({ categorias }) {
  if (categorias.capacidad_percibida.nivel !== 'alto') return null;
  if (categorias.ruta_gestion.nivel !== 'bajo') return null;
  return {
    codigo: 'EMPOFAM_CONFIANZA_SIN_RUTA',
    nivel: 'oportunidad',
    titulo: 'Confianza interna sin ruta externa',
    evidencia: [`Capacidad percibida: ${categorias.capacidad_percibida.etiqueta}`, `Ruta de gestión: ${categorias.ruta_gestion.etiqueta}`],
    lectura: 'La familia confía en su propia capacidad de resolver problemas, pero no identifica a quién acudir cuando necesita algo — una fortaleza interna con una brecha de información sobre recursos externos.',
    preguntas: ['¿Qué instituciones, programas o personas conoce la familia en su territorio?'],
    estrategias: ['Explorar junto con el Mapa de Pertenencia (F1) qué redes institucionales podrían activarse.'],
  };
}

function reglaAgenciaSinParticipacion({ categorias }) {
  if (categorias.agencia_percibida.nivel !== 'alto') return null;
  if (categorias.participacion.nivel !== 'bajo') return null;
  return {
    codigo: 'EMPOFAM_AGENCIA_SIN_PARTICIPACION',
    nivel: 'oportunidad',
    titulo: 'Agencia sin participación activa',
    evidencia: [`Agencia percibida: ${categorias.agencia_percibida.etiqueta}`, `Participación en decisiones: ${categorias.participacion.etiqueta}`],
    lectura: 'La familia siente que puede influir en su situación, pero reporta baja participación efectiva en las decisiones que la afectan — vale la pena explorar esta diferencia entre percepción y práctica.',
    preguntas: ['¿Qué dificulta que la familia participe más activamente en esas decisiones?'],
  };
}

// Cubre exhaustivamente el resto (ni las 4 en "alto", ni las 4 en "bajo"):
// identifica dinámicamente la dimensión más y menos presente.
function reglaMixto({ categorias }) {
  const RANGO = { bajo: 0, medio: 1, alto: 2 };
  const claves = Object.keys(categorias);
  const todasAltas = claves.every((k) => categorias[k].nivel === 'alto');
  const todasBajas = claves.every((k) => categorias[k].nivel === 'bajo');
  if (todasAltas || todasBajas) return null;

  const ordenadas = [...claves].sort((a, b) => RANGO[categorias[b].nivel] - RANGO[categorias[a].nivel]);
  const mas = ordenadas[0];
  const menos = ordenadas[ordenadas.length - 1];
  return {
    codigo: 'EMPOFAM_MIXTO',
    nivel: 'oportunidad',
    titulo: 'Empoderamiento familiar con dimensiones desiguales',
    evidencia: claves.map((k) => `${NOMBRE_PREGUNTA[k]}: ${categorias[k].etiqueta}`),
    lectura: `El empoderamiento percibido varía según la dimensión: "${NOMBRE_PREGUNTA[mas]}" es la más presente, mientras "${NOMBRE_PREGUNTA[menos]}" es la que menos se percibe.`,
    preguntas: [`¿Qué sostiene a "${NOMBRE_PREGUNTA[mas]}" para la familia?`, `¿Qué ayudaría a fortalecer "${NOMBRE_PREGUNTA[menos]}"?`],
  };
}

export const EMPODERAMIENTO_FAMILIAR = {
  id: 'EMPOFAM',
  nombre: 'Empoderamiento Familiar',
  descripcion: 'Percepción de la familia sobre su propia capacidad de gestión y decisión frente a su situación. Preguntas de diseño propio — no son los ítems de la Family Empowerment Scale original.',
  fuente: 'docs/matriz-variables-indicadores.md#c-familia',
  preguntas: PREGUNTAS,
  reglas: [reglaConsolidado, reglaAFortalecer, reglaConfianzaSinRuta, reglaAgenciaSinParticipacion, reglaMixto],
};
