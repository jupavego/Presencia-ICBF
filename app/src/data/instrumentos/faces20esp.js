// FACES-20esp — Family Adaptability and Cohesion Evaluation Scale, versión
// española de 20 ítems (Martínez-Pampliega, Iraurgi, Galíndez & Sanz, 2006),
// a partir del FACES-II de Olson (materiales cedidos por David H. Olson).
//
// Fuente de los 20 ítems (Anexo 1 del paper, ítems sombreados de los 50 del
// FACES-II original): instrumentos/Family_Adaptability_and_Cohesion_Evaluation_Scale_.pdf,
// extraído directamente con pdftotext. Escala de respuesta: Likert 1-5
// (Nunca o casi nunca a Casi siempre). Ninguno de los 20 ítems seleccionados
// aparenta redacción en sentido inverso por su enunciado — el paper no trae
// una clave de corrección explícita para la versión final de 20 ítems, así
// que se aplica la media directa por subescala, sin inversión.
//
// Reglas de interacción: usan el modelo circumplejo curvilíneo de Olson
// (cohesión y adaptabilidad extremas = potencialmente disfuncionales, no un
// corte inventado por el equipo — ver
// docs/mapa-teorico-marcos-conceptuales.md#modelo-circumplejo-de-olson-circumplex-model
// y docs/reglas-puntuacion-interpretacion.md, sección FACES-20esp).
// Limitación ya documentada: en validaciones hispanohablantes repetidas, las
// subescalas extremas (Enmeshed/Rigid) muestran psicometría más débil — se
// incorpora esa cautela directamente en la lectura de los patrones extremos.

const ITEMS_COHESION = [
  { id: 'c1', texto: 'Los miembros de la familia se sienten muy cercanos unos a otros.' },
  { id: 'c5', texto: 'Los miembros de la familia asumen las decisiones que se toman de manera conjunta como familia.' },
  { id: 'c9', texto: 'Los miembros de la familia se piden ayuda mutuamente.' },
  { id: 'c13', texto: 'En nuestra familia hacemos cosas juntos.' },
  { id: 'c23', texto: 'En nuestra familia nos reunimos todos juntos en la misma habitación (sala, cocina).' },
  { id: 'c25', texto: 'A los miembros de la familia les gusta pasar su tiempo libre juntos.' },
  { id: 'c27', texto: 'Los miembros de la familia se apoyan unos a otros en los momentos difíciles.' },
  { id: 'c29', texto: 'Los miembros de la familia comparten intereses y hobbies.' },
  { id: 'c38', texto: 'Los miembros de la familia se consultan unos a otros sus decisiones.' },
  { id: 'c42', texto: 'La unidad familiar es una preocupación principal.' },
];

const ITEMS_ADAPTABILIDAD = [
  { id: 'a2', texto: 'Cuando hay que resolver problemas, se siguen las propuestas de los hijos.' },
  { id: 'a4', texto: 'En nuestra familia la disciplina (normas, obligaciones, consecuencias, castigos) es justa.' },
  { id: 'a10', texto: 'En cuanto a su disciplina, se tiene en cuenta la opinión de los hijos (normas, obligaciones).' },
  { id: 'a12', texto: 'Cuando surgen problemas, negociamos para encontrar una solución.' },
  { id: 'a16', texto: 'Los miembros de la familia dicen lo que quieren libremente.' },
  { id: 'a26', texto: 'En nuestra familia, a todos nos resulta fácil expresar nuestra opinión.' },
  { id: 'a28', texto: 'En nuestra familia se intentan nuevas formas de resolver los problemas.' },
  { id: 'a34', texto: 'Todos tenemos voz y voto en las decisiones familiares importantes.' },
  { id: 'a41', texto: 'Los padres y los hijos hablan juntos sobre el castigo.' },
  { id: 'a47', texto: 'Los miembros de la familia comentamos los problemas y nos sentimos muy bien con las soluciones encontradas.' },
];

const OPCIONES = [
  { valor: 1, etiqueta: 'Nunca o casi nunca' },
  { valor: 2, etiqueta: 'Pocas veces' },
  { valor: 3, etiqueta: 'A veces' },
  { valor: 4, etiqueta: 'Con frecuencia' },
  { valor: 5, etiqueta: 'Casi siempre' },
];

// Bandas basadas en la lógica curvilínea del propio modelo de Olson, no en
// un corte inventado: los extremos son los que la teoría marca como
// potencialmente disfuncionales, el rango medio es el "balanceado".
function nivel(media) {
  if (media <= 2.0) return 'bajo';
  if (media >= 4.0) return 'alto';
  return 'balanceado';
}

const POLO_BAJO = { cohesion: 'desligada', adaptabilidad: 'rígida' };
const POLO_ALTO = { cohesion: 'enmarañada', adaptabilidad: 'caótica' };
const NOMBRE_DIM = { cohesion: 'Cohesión', adaptabilidad: 'Adaptabilidad' };

function reglaBalanceada({ puntajes }) {
  if (nivel(puntajes.cohesion) !== 'balanceado' || nivel(puntajes.adaptabilidad) !== 'balanceado') return null;
  return {
    codigo: 'FACES_BALANCEADO',
    nivel: 'fortaleza',
    titulo: 'Funcionamiento balanceado en cohesión y adaptabilidad',
    evidencia: [`Cohesión: ${puntajes.cohesion.toFixed(1)}/5 (balanceado)`, `Adaptabilidad: ${puntajes.adaptabilidad.toFixed(1)}/5 (balanceado)`],
    lectura: 'Ambas dimensiones se ubican en el rango que el modelo circumplejo de Olson asocia con mayor funcionalidad — ni cercanía ni capacidad de cambio en un extremo.',
    preguntas: ['¿Qué de esto reconoce la familia en su día a día?'],
    estrategias: ['Reconocer explícitamente esta configuración como una fortaleza a mantener, sin que requiera intervención adicional.'],
  };
}

// Exactamente una dimensión en extremo, la otra balanceada (4 combinaciones).
function reglaExtremoAislado({ puntajes }) {
  const nivCoh = nivel(puntajes.cohesion);
  const nivAda = nivel(puntajes.adaptabilidad);
  const extremos = [];
  if (nivCoh !== 'balanceado' && nivAda === 'balanceado') extremos.push('cohesion');
  if (nivAda !== 'balanceado' && nivCoh === 'balanceado') extremos.push('adaptabilidad');
  if (extremos.length !== 1) return null;
  const dim = extremos[0];
  const nivelDim = dim === 'cohesion' ? nivCoh : nivAda;
  const polo = nivelDim === 'bajo' ? POLO_BAJO[dim] : POLO_ALTO[dim];
  return {
    codigo: `FACES_EXTREMO_${dim.toUpperCase()}`,
    nivel: 'oportunidad',
    titulo: `Extremo aislado en ${NOMBRE_DIM[dim]}`,
    evidencia: [`Cohesión: ${puntajes.cohesion.toFixed(1)}/5 (${nivCoh})`, `Adaptabilidad: ${puntajes.adaptabilidad.toFixed(1)}/5 (${nivAda})`],
    lectura: `${NOMBRE_DIM[dim]} se ubica en el extremo "${polo}" según el modelo de Olson, mientras la otra dimensión está en el rango balanceado — vale la pena explorar específicamente esta dimensión con la familia, no la configuración completa.`,
    preguntas: [`¿Cómo describe la familia su ${dim === 'cohesion' ? 'cercanía y vínculo' : 'capacidad de adaptarse a los cambios'}?`],
    estrategias: [`Profundizar en ${NOMBRE_DIM[dim]} en el próximo encuentro, sin asumir que la otra dimensión también necesita atención.`],
  };
}

// Ambas dimensiones en extremo (4 combinaciones, las 4 esquinas del
// circumplejo de Olson).
function reglaExtremoDoble({ puntajes }) {
  const nivCoh = nivel(puntajes.cohesion);
  const nivAda = nivel(puntajes.adaptabilidad);
  if (nivCoh === 'balanceado' || nivAda === 'balanceado') return null;
  const poloCoh = nivCoh === 'bajo' ? POLO_BAJO.cohesion : POLO_ALTO.cohesion;
  const poloAda = nivAda === 'bajo' ? POLO_BAJO.adaptabilidad : POLO_ALTO.adaptabilidad;
  return {
    codigo: `FACES_DOBLE_${nivCoh.toUpperCase()}_${nivAda.toUpperCase()}`,
    nivel: 'profundizacion',
    titulo: `Configuración ${poloCoh}-${poloAda}`,
    evidencia: [`Cohesión: ${puntajes.cohesion.toFixed(1)}/5 (${nivCoh})`, `Adaptabilidad: ${puntajes.adaptabilidad.toFixed(1)}/5 (${nivAda})`],
    lectura: `Ambas dimensiones se ubican en un extremo del modelo de Olson (familia "${poloCoh}" en cohesión, "${poloAda}" en adaptabilidad) — es una de las combinaciones que la teoría marca como potencialmente disfuncional. Se presenta como hipótesis a conversar con la familia, nunca como una conclusión: las subescalas extremas de este modelo han mostrado psicometría más débil en validaciones hispanohablantes, incluida esta.`,
    preguntas: ['¿Esta descripción coincide con cómo la familia vive su día a día?', '¿Hay algo de esta configuración que la familia quisiera cambiar?'],
    estrategias: ['Explorar ambas dimensiones en la conversación antes de sacar cualquier conclusión — el resultado del instrumento es un punto de partida, no un diagnóstico de la familia.'],
    riesgos: ['Dos dimensiones en extremo simultáneamente es la configuración que más vale la pena priorizar para profundizar, considerando además que la evidencia psicométrica de estas subescalas extremas es más débil que la del rango balanceado.'],
  };
}

export const FACES20ESP = {
  id: 'FACES20ESP',
  nombre: 'Cohesión y Adaptabilidad Familiar (FACES-20esp)',
  descripcion: 'Mide cohesión (vínculo emocional) y adaptabilidad (capacidad de cambio ante el estrés) familiar, según el modelo circumplejo de Olson.',
  fuente: 'docs/catalogo-instrumentos-psicosociales.md#faces-20esp--no-es-faces-iv',
  formula: 'promedio',
  opciones: OPCIONES,
  subescalas: [
    { id: 'cohesion', nombre: 'Cohesión', items: ITEMS_COHESION },
    { id: 'adaptabilidad', nombre: 'Adaptabilidad', items: ITEMS_ADAPTABILIDAD },
  ],
  reglas: [reglaBalanceada, reglaExtremoAislado, reglaExtremoDoble],
};
