// MSPSS — Multidimensional Scale of Perceived Social Support (Zimet,
// Dahlem, Zimet & Farley, 1988).
//
// Fuente de los 12 ítems y la fórmula: instrumentos/MSPSS.pdf (extraído
// directamente del PDF, no reconstruido de memoria). Traducción al
// español: propia del equipo, directa del original en inglés — el PDF
// fuente solo trae el original y no hay ninguna validación hispanohablante
// confirmada en la carpeta (ver
// docs/catalogo-instrumentos-psicosociales.md#mspss--multidimensional-scale-of-perceived-social-support).
// Si más adelante se consigue una validación en español específica, debería
// preferirse esa traducción sobre esta. Reglas de interacción:
// docs/reglas-puntuacion-interpretacion.md, sección MSPSS.

const ITEMS_OTRO = [
  { id: 'otro_cerca', texto: 'Hay una persona especial que está cerca cuando la necesito.' },
  { id: 'otro_compartir', texto: 'Hay una persona especial con quien puedo compartir mis alegrías y tristezas.' },
  { id: 'otro_consuelo', texto: 'Tengo una persona especial que es una verdadera fuente de consuelo para mí.' },
  { id: 'otro_sentimientos', texto: 'Hay una persona especial en mi vida que se preocupa por mis sentimientos.' },
];

const ITEMS_FAMILIA = [
  { id: 'familia_ayuda', texto: 'Mi familia realmente trata de ayudarme.' },
  { id: 'familia_apoyo', texto: 'Recibo de mi familia el apoyo emocional que necesito.' },
  { id: 'familia_hablar', texto: 'Puedo hablar de mis problemas con mi familia.' },
  { id: 'familia_decisiones', texto: 'Mi familia está dispuesta a ayudarme a tomar decisiones.' },
];

const ITEMS_AMIGOS = [
  { id: 'amigos_ayuda', texto: 'Mis amigos realmente tratan de ayudarme.' },
  { id: 'amigos_contar', texto: 'Puedo contar con mis amigos cuando las cosas salen mal.' },
  { id: 'amigos_compartir', texto: 'Tengo amigos con quienes puedo compartir mis alegrías y tristezas.' },
  { id: 'amigos_hablar', texto: 'Puedo hablar de mis problemas con mis amigos.' },
];

const OPCIONES = [
  { valor: 1, etiqueta: 'Muy en desacuerdo' },
  { valor: 2, etiqueta: 'En fuerte desacuerdo' },
  { valor: 3, etiqueta: 'Levemente en desacuerdo' },
  { valor: 4, etiqueta: 'Neutral' },
  { valor: 5, etiqueta: 'Levemente de acuerdo' },
  { valor: 6, etiqueta: 'Fuertemente de acuerdo' },
  { valor: 7, etiqueta: 'Muy de acuerdo' },
];

// Rangos orientativos, no oficiales (ya documentados así en el catálogo):
// no hay normas poblacionales publicadas para el MSPSS.
function nivel(media) {
  if (media <= 2.9) return 'bajo';
  if (media <= 5) return 'moderado';
  return 'alto';
}

const NOMBRE_FUENTE = { familia: 'familia', amigos: 'amigos', otro: 'otro significativo' };

// Generalizada a las 3 fuentes (antes solo detectaba concentración en
// familia): cualquiera de las tres puede quedar como única fuente alta con
// las otras dos bajas.
function reglaConcentrado({ puntajes }) {
  const claves = Object.keys(puntajes);
  const alta = claves.find((k) => nivel(puntajes[k]) === 'alto');
  if (!alta) return null;
  const otras = claves.filter((k) => k !== alta);
  if (!otras.every((k) => nivel(puntajes[k]) === 'bajo')) return null;
  const nombreAlta = NOMBRE_FUENTE[alta];
  return {
    codigo: `MSPSS_CONCENTRADO_${alta.toUpperCase()}`,
    nivel: 'oportunidad',
    titulo: `Apoyo concentrado en ${nombreAlta}`,
    evidencia: claves.map((k) => `${NOMBRE_FUENTE[k]}: ${puntajes[k].toFixed(1)}/7 (${nivel(puntajes[k])})`),
    lectura: `La red de apoyo percibida depende principalmente de la fuente "${nombreAlta}" — patrón que conecta directamente con las esferas D/F y el motor de lectura del F1.`,
    preguntas: [`¿Qué pasaría si el apoyo de ${nombreAlta} no estuviera disponible en algún momento?`, `¿Hay otras personas fuera de ese círculo con las que podría contar?`],
    oportunidad: 'Explorar junto con el Mapa de Pertenencia (F1) si conviene diversificar la red hacia otras fuentes.',
    estrategias: [
      `Usar el Mapa de Pertenencia (F1) para identificar vínculos potenciales fuera de ${nombreAlta}, aunque hoy no estén activos.`,
      'Explorar el interés de la persona en vincularse a Encuentros Comunitarios de Cuidado (F5) como espacio para ampliar la red.',
    ],
    riesgos: [
      `Si la fuente "${nombreAlta}" que sostiene este apoyo se debilitara, la persona podría quedar con apoyo social percibido muy bajo — vale la pena anticiparlo en el plan de acompañamiento, no solo registrarlo.`,
    ],
  };
}

function reglaDiversificado({ puntajes }) {
  const niveles = [puntajes.familia, puntajes.amigos, puntajes.otro].map(nivel);
  if (niveles.every((n) => n === 'alto' || n === 'moderado')) {
    return {
      codigo: 'MSPSS_DIVERSIFICADO',
      nivel: 'fortaleza',
      titulo: 'Apoyo diversificado',
      evidencia: [`Familia: ${puntajes.familia.toFixed(1)}/7`, `Amigos: ${puntajes.amigos.toFixed(1)}/7`, `Otro significativo: ${puntajes.otro.toFixed(1)}/7`],
      lectura: 'El apoyo social percibido se distribuye en más de una fuente; no depende de un solo círculo.',
      preguntas: ['¿Cuáles de estas fuentes de apoyo considera más significativas hoy?'],
      estrategias: [
        'Reconocer explícitamente esta diversidad con la persona — es una fortaleza sobre la cual construir, no solo un resultado a archivar.',
        'Si estos vínculos aún no están registrados en el Mapa de Pertenencia (F1), documentarlos ahí para tener una lectura conjunta de la red.',
      ],
    };
  }
  return null;
}

function reglaVacio({ puntajes }) {
  const niveles = [puntajes.familia, puntajes.amigos, puntajes.otro].map(nivel);
  if (niveles.every((n) => n === 'bajo')) {
    return {
      codigo: 'MSPSS_VACIO',
      nivel: 'profundizacion',
      titulo: 'Vacío de apoyo percibido',
      evidencia: [`Familia: ${puntajes.familia.toFixed(1)}/7 (bajo)`, `Amigos: ${puntajes.amigos.toFixed(1)}/7 (bajo)`, `Otro significativo: ${puntajes.otro.toFixed(1)}/7 (bajo)`],
      lectura: 'Las tres fuentes de apoyo evaluadas se perciben en nivel bajo — señal relevante para activar el Mapa de Pertenencia (F1) como herramienta de profundización.',
      preguntas: ['¿Hay alguien a quien acudiría si necesitara ayuda hoy?', '¿Qué tipo de apoyo siente que le falta más?'],
      oportunidad: 'Profundizar con el Mapa de Pertenencia (F1) y explorar activamente la construcción de red.',
      estrategias: [
        'Activar el Mapa de Pertenencia (F1) como siguiente paso inmediato del encuentro.',
        'Explorar con la persona su interés en vincularse a Encuentros Comunitarios de Cuidado (F5), como primer espacio para iniciar la construcción de red.',
        'Revisar si el caso cumple criterios de priorización del servicio (derivación institucional, situación de mayor vulnerabilidad) definidos en la Guía Operativa.',
      ],
      riesgos: [
        'Baja percepción de apoyo en las tres fuentes evaluadas es un factor relevante a considerar en la priorización y el seguimiento del caso, especialmente si coincide con una situación de crisis activa — es una señal para el equipo, no una conclusión sobre la persona.',
      ],
    };
  }
  return null;
}

// Cubre exhaustivamente lo que las 3 reglas anteriores no capturan (ej.
// una fuente moderada + una alta + una baja; dos moderadas + una baja):
// cualquier combinación con niveles mixtos que no sea "todo alto/moderado"
// (diversificado), "todo bajo" (vacío), ni "una alta con las otras dos
// bajas" (concentrado). Por construcción, entre las 4 reglas no debería
// quedar ninguna combinación de respuesta sin lectura específica.
function reglaMixto({ puntajes }) {
  const claves = Object.keys(puntajes);
  const niveles = claves.map((k) => nivel(puntajes[k]));
  const todasAltoModerado = niveles.every((n) => n === 'alto' || n === 'moderado');
  const todasBajo = niveles.every((n) => n === 'bajo');
  const unaAltaOtrasBajas = claves.some(
    (k) => nivel(puntajes[k]) === 'alto' && claves.filter((k2) => k2 !== k).every((k2) => nivel(puntajes[k2]) === 'bajo'),
  );
  if (todasAltoModerado || todasBajo || unaAltaOtrasBajas) return null;

  const ordenados = [...claves].sort((a, b) => puntajes[b] - puntajes[a]);
  const mas = ordenados[0];
  const menos = ordenados[ordenados.length - 1];
  return {
    codigo: 'MSPSS_MIXTO',
    nivel: 'oportunidad',
    titulo: 'Apoyo social con niveles mixtos',
    evidencia: claves.map((k) => `${NOMBRE_FUENTE[k]}: ${puntajes[k].toFixed(1)}/7 (${nivel(puntajes[k])})`),
    lectura: `El apoyo percibido varía según la fuente: "${NOMBRE_FUENTE[mas]}" es la que se percibe con más apoyo, mientras "${NOMBRE_FUENTE[menos]}" es la más baja — no es un vacío generalizado ni una concentración total en una sola fuente, sino una red desigual entre círculos.`,
    preguntas: [`¿Qué hace que el apoyo de ${NOMBRE_FUENTE[mas]} se sienta más disponible?`, `¿Qué podría fortalecer el apoyo de ${NOMBRE_FUENTE[menos]}?`],
    estrategias: [
      `Reconocer y apoyarse en la fuente más fuerte (${NOMBRE_FUENTE[mas]}) mientras se explora cómo fortalecer ${NOMBRE_FUENTE[menos]}.`,
      'Registrar esta distribución en el Mapa de Pertenencia (F1) para tener una lectura conjunta de la red.',
    ],
  };
}

export const MSPSS = {
  id: 'MSPSS',
  nombre: 'Apoyo Social Percibido (MSPSS)',
  descripcion: 'Percepción de disponibilidad de apoyo desde la familia, los amigos y otra persona significativa.',
  fuente: 'docs/catalogo-instrumentos-psicosociales.md#mspss--multidimensional-scale-of-perceived-social-support',
  formula: 'promedio',
  opciones: OPCIONES,
  subescalas: [
    { id: 'otro', nombre: 'Otro significativo', items: ITEMS_OTRO },
    { id: 'familia', nombre: 'Familia', items: ITEMS_FAMILIA },
    { id: 'amigos', nombre: 'Amigos', items: ITEMS_AMIGOS },
  ],
  reglas: [reglaConcentrado, reglaDiversificado, reglaVacio, reglaMixto],
};
