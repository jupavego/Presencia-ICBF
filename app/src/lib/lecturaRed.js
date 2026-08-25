// Motor de lectura de red — F1 Mapa de Pertenencia.
//
// Principio: Dato → Patrón → Hipótesis / preguntas orientadoras.
// Inspirado en un prototipo propio del equipo del servicio Presencia,
// adaptado a los campos que efectivamente captura el formulario
// (nombre, ámbito, círculo de cercanía y tipos de apoyo).
//
// Importante: no produce diagnósticos clínicos, sociales ni familiares.
// Genera lecturas descriptivas e hipótesis orientadoras que deben
// validarse conversando con la familia/persona y con el criterio
// profesional del Equipo de Acompañamiento.

export const AMBITOS_TIPO = {
  Familia: 'natural',
  'Ocupación': 'natural',
  'Instituciones y profesionales': 'institucional',
  'Vida Social': 'natural',
};

export const PESO_CIRCULO = { Interior: 3, Intermedio: 2, Externo: 1 };

// Fuente: guía metodológica del F1 — tipos de apoyo que puede aportar cada vínculo.
export const TIPOS_APOYO = ['Emocional', 'Contención', 'Práctico', 'Orientación'];

function calcularMetricas(contactos) {
  const porAmbito = {};
  const porCirculo = {};
  const porApoyo = {};
  Object.keys(AMBITOS_TIPO).forEach((a) => { porAmbito[a] = 0; });
  Object.keys(PESO_CIRCULO).forEach((c) => { porCirculo[c] = 0; });
  TIPOS_APOYO.forEach((a) => { porApoyo[a] = 0; });

  contactos.forEach((c) => {
    if (porAmbito[c.cuadrante] !== undefined) porAmbito[c.cuadrante] += 1;
    if (porCirculo[c.circulo] !== undefined) porCirculo[c.circulo] += 1;
    (c.apoyos || []).forEach((a) => { if (porApoyo[a] !== undefined) porApoyo[a] += 1; });
  });

  return { total: contactos.length, porAmbito, porCirculo, porApoyo };
}

function calcularDiversidad(m) {
  const presentes = Object.values(m.porAmbito).filter((v) => v > 0).length;
  const total = Object.keys(AMBITOS_TIPO).length;
  return { presentes, total, porcentaje: total ? Math.round((presentes / total) * 100) : 0 };
}

function calcularProximidad(m) {
  if (!m.total) return 0;
  const puntos = Object.entries(m.porCirculo).reduce((sum, [c, n]) => sum + n * (PESO_CIRCULO[c] || 0), 0);
  return Math.round((puntos / (m.total * 3)) * 100);
}

function calcularConcentracion(m) {
  if (!m.total) return { ambito: null, porcentaje: 0, nivel: 'sin_evidencia' };
  const [ambito, cantidad] = Object.entries(m.porAmbito).sort((a, b) => b[1] - a[1])[0];
  const porcentaje = Math.round((cantidad / m.total) * 100);
  const nivel = porcentaje >= 70 ? 'alta' : porcentaje >= 50 ? 'media' : 'baja';
  return { ambito, cantidad, porcentaje, nivel };
}

function calcularNaturaleza(contactos) {
  const natural = contactos.filter((c) => AMBITOS_TIPO[c.cuadrante] === 'natural').length;
  const institucional = contactos.filter((c) => AMBITOS_TIPO[c.cuadrante] === 'institucional').length;
  const total = contactos.length;
  return {
    natural,
    institucional,
    porcentajeNatural: total ? Math.round((natural / total) * 100) : 0,
  };
}

function actoresPorApoyo(contactos, tipo) {
  return contactos.filter((c) => (c.apoyos || []).includes(tipo)).map((c) => c.nombre);
}

function detectarPatrones(contactos, m) {
  const patrones = [];
  const diversidad = calcularDiversidad(m);
  const concentracion = calcularConcentracion(m);
  const interiores = contactos.filter((c) => c.circulo === 'Interior');

  if (diversidad.presentes >= 3) {
    patrones.push({
      codigo: 'RED_DIVERSIFICADA',
      nivel: 'fortaleza',
      titulo: 'Red con diversidad de ámbitos',
      evidencia: [`${diversidad.presentes} de ${diversidad.total} ámbitos representados`],
      lectura: 'Los vínculos registrados se distribuyen en distintos espacios de la vida de la familia o la persona.',
      preguntas: ['¿Cuáles de estos ámbitos considera más significativos hoy?', '¿Hay alguno que quisiera fortalecer?'],
      oportunidad: 'Reconocer y aprovechar la diversidad de la red existente.',
    });
  }

  if (concentracion.nivel === 'alta') {
    patrones.push({
      codigo: 'CONCENTRACION_AMBITO',
      nivel: 'oportunidad',
      titulo: `Alta concentración en ${concentracion.ambito}`,
      evidencia: [`${concentracion.porcentaje}% de los vínculos pertenecen a ${concentracion.ambito}`],
      lectura: `La red registrada se concentra principalmente en el ámbito ${concentracion.ambito}.`,
      preguntas: ['¿Esta concentración refleja la red que la familia desea mantener?', '¿Hay otros espacios que quisiera ampliar?'],
      oportunidad: 'Explorar si conviene diversificar la red hacia otros ámbitos.',
    });
  }

  if (m.total >= 3 && interiores.length === 0) {
    patrones.push({
      codigo: 'BAJA_PROXIMIDAD',
      nivel: 'profundizacion',
      titulo: 'Sin vínculos en el círculo interior',
      evidencia: ['0 vínculos registrados en el círculo Interior'],
      lectura: 'En el mapa registrado no aparecen relaciones ubicadas en el círculo de mayor cercanía.',
      preguntas: ['¿Hay alguna persona a la que acudiría primero ante una dificultad?', '¿Existe alguna relación cercana que no se haya registrado aún?'],
      oportunidad: 'Profundizar en la percepción de cercanía y disponibilidad de la red.',
    });
  }

  TIPOS_APOYO.forEach((tipo) => {
    const actores = actoresPorApoyo(contactos, tipo);
    if (actores.length === 1) {
      patrones.push({
        codigo: `APOYO_CONCENTRADO_${tipo}`,
        nivel: 'oportunidad',
        titulo: `Apoyo ${tipo.toLowerCase()} concentrado en una sola persona`,
        evidencia: [`${actores[0]} es la única persona registrada para este tipo de apoyo`],
        lectura: `El apoyo ${tipo.toLowerCase()} depende de un único vínculo dentro de la red registrada.`,
        preguntas: [`¿Qué pasaría si ${actores[0]} no estuviera disponible?`, '¿Existe alguien más que pueda brindar este apoyo?'],
        oportunidad: 'Explorar la posibilidad de diversificar este tipo de apoyo.',
      });
    } else if (actores.length >= 3) {
      patrones.push({
        codigo: `APOYO_DIVERSIFICADO_${tipo}`,
        nivel: 'fortaleza',
        titulo: `Red diversificada para el apoyo ${tipo.toLowerCase()}`,
        evidencia: [`${actores.length} personas registradas: ${actores.join(', ')}`],
        lectura: `Existen varias personas que podrían brindar apoyo ${tipo.toLowerCase()}.`,
        preguntas: ['¿Cuáles de estas personas considera más significativas para este tipo de apoyo?'],
        oportunidad: 'Reconocer y fortalecer esta capacidad ya presente en la red.',
      });
    }
  });

  const instituciones = contactos.filter((c) => c.cuadrante === 'Instituciones y profesionales');
  const institucionesInterior = instituciones.filter((c) => c.circulo === 'Interior');
  if (instituciones.length >= 4 || institucionesInterior.length >= 2) {
    patrones.push({
      codigo: 'CENTRALIDAD_INSTITUCIONAL',
      nivel: 'profundizacion',
      titulo: 'Presencia relevante de relaciones institucionales',
      evidencia: [`${instituciones.length} vínculo(s) institucional(es)`, `${institucionesInterior.length} en el círculo Interior`],
      lectura: 'La red registrada muestra una presencia importante de instituciones y profesionales.',
      preguntas: ['¿Qué papel cumplen hoy estas instituciones?', '¿Qué apoyos provienen de la red familiar, social o comunitaria?'],
      oportunidad: 'Explorar el equilibrio entre redes institucionales y redes naturales.',
    });
  }

  const multifuncionales = contactos.filter((c) => (c.apoyos || []).length >= 2);
  if (multifuncionales.length > 0) {
    patrones.push({
      codigo: 'NODOS_MULTIFUNCIONALES',
      nivel: 'oportunidad',
      titulo: 'Personas que sostienen varios tipos de apoyo a la vez',
      evidencia: multifuncionales.map((c) => `${c.nombre}: ${c.apoyos.join(', ')}`),
      lectura: 'Algunos vínculos concentran distintos tipos de apoyo dentro de la red.',
      preguntas: ['¿Qué tan disponible está esta persona para sostener varios apoyos?', '¿Existen otros vínculos que puedan complementarlos?'],
      oportunidad: 'Reconocer estos vínculos clave y valorar si conviene distribuir mejor los apoyos.',
    });
  }

  return patrones;
}

function clasificarPerfil(m) {
  if (!m.total) {
    return { nombre: 'Información insuficiente', descripcion: 'Aún no hay vínculos registrados para generar una lectura.' };
  }
  const proximidad = calcularProximidad(m);
  const diversidad = calcularDiversidad(m);
  if (proximidad >= 65 && diversidad.presentes >= 3) {
    return { nombre: 'Red con fortalezas identificables', descripcion: 'Se observan vínculos cercanos y diversidad de ámbitos.' };
  }
  if (proximidad < 35 && diversidad.presentes <= 2) {
    return { nombre: 'Red para profundizar', descripcion: 'La configuración registrada muestra baja cercanía o poca diversidad de ámbitos.' };
  }
  return { nombre: 'Red en configuración diversa', descripcion: 'La red presenta características mixtas; conviene interpretarla en conversación con la familia.' };
}

function contactosValidos(contactos) {
  return contactos.filter((c) => c.nombre && c.nombre.trim());
}

// Lee un mapa (actual o potencial) y devuelve perfil, métricas y patrones.
export function leerRed(contactos) {
  const validos = contactosValidos(contactos);
  const m = calcularMetricas(validos);
  return {
    total: m.total,
    diversidad: calcularDiversidad(m),
    proximidad: calcularProximidad(m),
    concentracion: calcularConcentracion(m),
    naturaleza: calcularNaturaleza(validos),
    perfil: clasificarPerfil(m),
    patrones: detectarPatrones(validos, m),
  };
}

// Compara la configuración del mapa actual con la del potencial, ámbito
// por ámbito, para orientar qué redes quisiera fortalecer la familia.
export function compararActualPotencial(actual, potencial) {
  const a = contactosValidos(actual);
  const p = contactosValidos(potencial);
  const ma = calcularMetricas(a);
  const mp = calcularMetricas(p);
  const brechas = Object.keys(AMBITOS_TIPO)
    .map((ambito) => ({ ambito, actual: ma.porAmbito[ambito] || 0, potencial: mp.porAmbito[ambito] || 0 }))
    .map((b) => ({ ...b, diferencia: b.potencial - b.actual }))
    .filter((b) => b.diferencia !== 0);
  return { brechas, crecimiento: p.length - a.length, hayDatos: a.length > 0 || p.length > 0 };
}

// Convierte el resultado de leerRed() en texto plano — se usa para
// imprimir la lectura automatizada como nota al pie del mapa exportado a
// imagen (ver svgAImagen.js), ya que el documento oficial de F1 no tiene
// líneas de texto donde insertar este análisis.
export function resumenLecturaParaExport(lectura) {
  const parrafos = [lectura.perfil.descripcion];
  if (lectura.total > 0) {
    parrafos.push(
      `${lectura.total} vínculo(s) registrados · ${lectura.diversidad.presentes}/${lectura.diversidad.total} ámbitos representados · ${lectura.proximidad}/100 índice de proximidad · ${lectura.naturaleza.porcentajeNatural}% red natural (no institucional).`,
    );
  }
  for (const p of lectura.patrones) {
    parrafos.push(`• ${p.titulo}: ${p.lectura}`);
  }
  parrafos.push('Esta lectura es descriptiva, no diagnóstica: debe validarse conversando con la familia o la persona, y con el criterio profesional del Equipo de Acompañamiento.');
  return { titulo: `Lectura automatizada del mapa — ${lectura.perfil.nombre}`, parrafos };
}
