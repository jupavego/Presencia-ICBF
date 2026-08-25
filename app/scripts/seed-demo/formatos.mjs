// Generadores de `datos` (jsonb) para los formatos oficiales que sí viven en
// `formatos_oficiales_datos`: F1, F3, F4, F6, F7, F8, F10 — más las tablas
// compartidas `familia_integrantes` y `compromisos` (F7/F6). Los shapes
// exactos vienen del spec de investigación (spec-formatos.md); acá se
// reproducen tal cual, incluyendo las inconsistencias reales de formato de
// fecha entre formatos (documentadas y dejadas anotadas para otra vuelta,
// no corregidas en esta automatización).
import { pick, pickN, pickAlgunos, fechaDDMMAAAA, fechaISO, fechaHaceDias, MONEY, marcado, marcadoUnicode, idLocal } from './utilFormatos.mjs';
import { formatoFecha } from './exportarOficial.mjs';

// --- F1 · Mapa de Pertenencia -------------------------------------------
const CUADRANTES = ['Familia', 'Ocupación', 'Instituciones y profesionales', 'Vida Social'];
const CIRCULOS = ['Interior', 'Intermedio', 'Externo'];
const TIPOS_APOYO = ['Emocional', 'Contención', 'Práctico', 'Orientación'];
const NOMBRES_VINCULO = ['Rosa', 'Carmen', 'Beatriz', 'Gloria', 'Marta', 'Esperanza', 'Ana', 'Doris', 'Fabián', 'Wilson', 'Diego', 'Camilo', 'Yeison', 'Profesora Luz', 'Pastor Elkin', 'Comadre Nury', 'Don Reinaldo', 'Vecina Consuelo', 'Tía Marleny', 'Padrino Jairo'];

function nuevoVinculo(cuadrante, circulo, nApoyos) {
  return {
    nombre: pick(NOMBRES_VINCULO),
    cuadrante,
    circulo,
    apoyos: pickAlgunos(TIPOS_APOYO, Math.max(0, nApoyos - 1), nApoyos),
    nota: '',
  };
}

export function generarF1(perfil) {
  const perfiles = {
    alta: { actual: 9, potencial: 4, circulosFavoritos: ['Interior', 'Intermedio'] },
    media: { actual: 6, potencial: 3, circulosFavoritos: ['Intermedio', 'Interior'] },
    baja: { actual: 2, potencial: 3, circulosFavoritos: ['Externo'] },
    atipica: { actual: 7, potencial: 6, circulosFavoritos: ['Externo', 'Interior'] },
  }[perfil.redSocial];

  const actual = [];
  for (let i = 0; i < perfiles.actual; i += 1) {
    const cuadrante = perfil.redSocial === 'baja'
      ? (i === 0 ? 'Instituciones y profesionales' : 'Familia')
      : CUADRANTES[i % CUADRANTES.length];
    actual.push(nuevoVinculo(cuadrante, pick(perfiles.circulosFavoritos), perfil.redSocial === 'baja' ? 1 : 2 + Math.round(Math.random())));
  }
  const potencial = [];
  for (let i = 0; i < perfiles.potencial; i += 1) {
    potencial.push(nuevoVinculo(CUADRANTES[i % CUADRANTES.length], 'Externo', 1));
  }
  return { actual, potencial };
}

// --- F3 · Acuerdo de Vinculación ----------------------------------------
function textoSiNo(esSi) {
  return esSi ? 'Si X_ No__' : 'Si __ NoX_';
}

export function generarF3(caso, hoy) {
  const [n, ...resto] = caso.nombre.split(' ');
  const nombreCompleto = caso.nombre;
  return {
    fechaCiudad: caso.municipio,
    fechaDia: String(hoy.getDate()),
    fechaMes: hoy.toLocaleDateString('es-CO', { month: 'long' }),
    fechaAnio: String(hoy.getFullYear()),
    fechaAnio2: String(hoy.getFullYear()).slice(-2),
    declaranteNombre: nombreCompleto,
    declaranteTipoDoc: 'CC',
    declaranteNumeroDoc: String(1_000_000_000 + Math.floor(Math.random() * 100_000_000)),
    declaranteExpedicion: caso.municipio,
    declaranteDireccion: `Calle ${10 + Math.floor(Math.random() * 80)} # ${5 + Math.floor(Math.random() * 40)}-${10 + Math.floor(Math.random() * 80)}`,
    declaranteCiudad: caso.municipio,
    declaranteTelFijo: '',
    declaranteCelular: `3${Math.floor(100000000 + Math.random() * 899999999)}`,
    autDatosTexto: textoSiNo(true),
    autSmsTexto: textoSiNo(true),
    menorFotosTexto: textoSiNo(true),
    menorAudiosTexto: textoSiNo(true),
    menorVideosTexto: textoSiNo(false),
    titularNombre: nombreCompleto,
    titularDocumento: String(1_000_000_000 + Math.floor(Math.random() * 100_000_000)),
    titularFotosTexto: textoSiNo(true),
    titularAudiosTexto: textoSiNo(true),
    titularVideosTexto: textoSiNo(false),
    firmante1Nombre: nombreCompleto,
    firmante2Nombre: '',
    menor1Nombre: '', menor1Documento: '',
    menor2Nombre: '', menor2Documento: '',
    menor3Nombre: '', menor3Documento: '',
    menor4Nombre: '', menor4Documento: '',
  };
}

// --- F4 · Encuesta de Satisfacción ---------------------------------------
const ESCALA_F4 = ['1 · Totalmente insatisfecho', '2 · Insatisfecho', '3 · Indiferente', '4 · Satisfecho', '5 · Totalmente satisfecho', 'N/A'];

export function generarF4(perfil, caso, profesional, hoy) {
  const idx = Math.round(perfil.t * 4); // 0..4 sobre las primeras 5 opciones de ESCALA_F4
  const respuestas = {};
  for (let i = 1; i <= 7; i += 1) {
    const jitter = Math.random() < 0.2 ? (Math.random() < 0.5 ? -1 : 1) : 0;
    respuestas[String(i)] = ESCALA_F4[Math.max(0, Math.min(4, idx + jitter))];
  }
  return {
    departamento: 'Antioquia',
    municipio: caso.municipio,
    fecha: fechaDDMMAAAA(hoy),
    profesionales: profesional.nombre,
    nombreResponde: caso.nombre,
    documentoResponde: String(1_000_000_000 + Math.floor(Math.random() * 100_000_000)),
    entiendeInfo: 'Sí',
    aceptaResponder: 'Sí',
    respuestaSolicitud: perfil.t >= 0.4 ? 'Sí' : 'No',
    fortalecioCapacidades: perfil.t >= 0.35 ? 'Sí' : 'No',
    respuestas,
    sugerencias: perfil.modo === 'extremo_bajo'
      ? 'Le gustaría que las visitas fueran más seguidas.'
      : 'Ninguna adicional, agradece el acompañamiento.',
  };
}

// --- F6 · Acompañamiento en el Entorno Familiar --------------------------
// Catálogos EXACTOS de F6AcompanamientoEntornoFamiliar.jsx (no listas
// inventadas) — así lo que siembra el script coincide con lo que el
// formulario puede reconstruir al reabrirse (useUltimoFormatoOficial +
// reconstruirChecklist comparan por igualdad exacta de string). No se
// importa el .jsx directo porque Node no entiende JSX sin un transpilador
// en este script.
const MOTIVOS_F6 = ['Fortalecimiento de relaciones familiares.', 'Dificultades en la convivencia familiar.', 'Fortalecimiento de capacidades de cuidado.', 'Necesidad de fortalecer redes de apoyo.', 'Situación relacionada con condiciones económicas.', 'Situación relacionada con acceso a servicios.', 'Necesidad de orientación frente a una situación familiar.', 'Situación relacionada con cambios o transiciones familiares.', 'Interés en fortalecer recursos y capacidades existentes.', 'Solicitud de orientación o acompañamiento frente a una situación específica.'];
const OBJETIVOS_F6 = ['Fortalecer capacidades familiares para el cuidado.', 'Fortalecer relaciones y vínculos familiares.', 'Favorecer estrategias para mejorar la convivencia.', 'Fortalecer redes de apoyo familiares y comunitarias.', 'Identificar recursos y fortalezas de la familia.', 'Promover autonomía y toma de decisiones.', 'Fortalecer capacidades para afrontar situaciones familiares.', 'Promover participación y corresponsabilidad familiar.', 'Favorecer la articulación con recursos institucionales o comunitarios.', 'Construir acuerdos y acciones de acompañamiento con la familia.'];
const HERRAMIENTAS_F6 = ['Diálogo para el Cuidado y el Buen Vivir.', 'Entrevista familiar.', 'Escucha activa y conversación reflexiva.', 'Cartografía de redes de apoyo.', 'Mapa de pertenencia.', 'Identificación de recursos y fortalezas familiares.', 'Análisis participativo de situaciones familiares.', 'Ejercicio de construcción de acuerdos.', 'Orientación y fortalecimiento de capacidades.', 'Identificación de necesidades de articulación institucional.'];
const COMPROMISOS_FAMILIA_TXT = ['Participar en los encuentros acordados.', 'Cumplir las fechas y horarios concertados.', 'Informar oportunamente dificultades para asistir.', 'Participar activamente en las actividades propuestas.', 'Implementar acuerdos construidos durante el acompañamiento.', 'Fortalecer prácticas de cuidado acordadas.', 'Activar o fortalecer redes de apoyo identificadas.', 'Realizar gestiones acordadas con otras instituciones o servicios.', 'Compartir información relevante para el desarrollo del acompañamiento.', 'Revisar conjuntamente los avances y dificultades del proceso.'];
const COMPROMISOS_ICBF_TXT = ['Realizar el acompañamiento acordado.', 'Cumplir las fechas y horarios concertados.', 'Brindar orientación relacionada con las necesidades identificadas.', 'Mantener confidencialidad sobre la información suministrada.', 'Realizar seguimiento a los acuerdos establecidos.', 'Facilitar información sobre servicios y recursos disponibles.', 'Orientar sobre rutas institucionales cuando corresponda.', 'Gestionar las articulaciones internas necesarias.', 'Orientar o facilitar articulaciones con actores externos cuando corresponda.', 'Revisar conjuntamente con la familia los resultados del acompañamiento.'];
const ASPECTOS_COMUNIDAD_TXT = ['Existencia de redes familiares activas.', 'Existencia de redes comunitarias activas.', 'Participación de la familia en espacios comunitarios.', 'Disponibilidad de personas significativas para la familia.', 'Presencia de relaciones de solidaridad.', 'Vinculación con organizaciones comunitarias.', 'Acceso a instituciones o servicios del territorio.', 'Potencial para fortalecer redes existentes.', 'Necesidad de ampliar o diversificar redes de apoyo.', 'Identificación de recursos comunitarios susceptibles de activación.'];
const CONTEXTO_TERRITORIAL_TXT = ['Barreras de acceso geográfico.', 'Dificultades de movilidad o transporte.', 'Condiciones de seguridad del territorio.', 'Limitaciones en la oferta institucional.', 'Dificultades de acceso a servicios sociales.', 'Condiciones económicas del territorio.', 'Dinámicas comunitarias que afectan a la familia.', 'Situaciones ambientales o territoriales relevantes.', 'Débil articulación entre actores institucionales y comunitarios.', 'Oportunidades o recursos territoriales susceptibles de aprovechamiento.'];
const RETOS_TXT = ['Fortalecer la participación de la familia.', 'Fortalecer redes familiares y comunitarias.', 'Mejorar la articulación institucional.', 'Ampliar el acceso a recursos y servicios.', 'Fortalecer capacidades familiares.', 'Mejorar la continuidad del acompañamiento.', 'Fortalecer el seguimiento a los acuerdos.', 'Aprovechar recursos existentes en el territorio.', 'Generar nuevas estrategias de acompañamiento.', 'Consolidar acciones de autonomía y sostenibilidad del proceso.'];

function matrizCompromisos(items) {
  return items.map((it) => `${it.descripcion} (${it.responsable}, ${fechaDDMMAAAA(new Date(it.fecha))}, ${it.estado})`).join(' | ');
}

export function generarCompromisos(perfil, origen) {
  const banco = origen === 'F6' ? COMPROMISOS_FAMILIA_TXT : ['Mantener rutinas de cuidado acordadas', 'Fortalecer la participación en el proyecto de vida', 'Sostener la red de apoyo identificada en F1'];
  const n = perfil.modo === 'extremo_bajo' ? 3 : perfil.modo === 'extremo_alto' ? 1 : 2;
  return pickAlgunos(banco, n, n).map((descripcion) => ({
    id: idLocal(),
    descripcion,
    responsable: pick(['Familia', 'ICBF', 'Conjunto']),
    fecha: fechaISO(fechaHaceDias(-14 - Math.floor(Math.random() * 30))),
    estado: perfil.t >= 0.6 ? pick(['En proceso', 'Cumplido']) : pick(['Pendiente', 'En proceso']),
    origen,
  }));
}

export function generarF6(perfil, caso, profesional, hoy, itemsCompromisos) {
  return {
    fecha: fechaDDMMAAAA(hoy),
    regional: 'Antioquia',
    centroZonal: profesional.centroZonal,
    numPeticion: caso.numeroPeticion,
    telefono: `3${Math.floor(100000000 + Math.random() * 899999999)}`,
    municipio: caso.municipio,
    direccion: `Calle ${10 + Math.floor(Math.random() * 80)} # ${5 + Math.floor(Math.random() * 40)}-${10 + Math.floor(Math.random() * 80)}`,
    barrio: pick(['Centro', 'San José', 'La Paz', 'El Progreso', 'Villa Nueva', 'Las Flores']),
    profesionales: profesional.nombre,
    participantes: `${caso.nombre} (participante), acudiente`,
    motivo: `${pick(MOTIVOS_F6)}. Seguimiento realizado en el marco del acompañamiento periódico del servicio.`,
    objetivo: pick(OBJETIVOS_F6),
    herramientas: pickAlgunos(HERRAMIENTAS_F6, 1, 3).join('; '),
    compromisoFamilia: `${pickAlgunos(COMPROMISOS_FAMILIA_TXT, 1, 3).join('; ')} | Matriz: ${matrizCompromisos(itemsCompromisos)}`,
    compromisoIcbf: pickAlgunos(COMPROMISOS_ICBF_TXT, 1, 2).join('; '),
    aspectosComunidad: pickAlgunos(ASPECTOS_COMUNIDAD_TXT, 1, 2).join('; '),
    contextoTerritorial: pickAlgunos(CONTEXTO_TERRITORIAL_TXT, 1, 2).join('; '),
    retos: pickAlgunos(RETOS_TXT, 1, 2).join('; '),
  };
}

// --- F7 · Ficha Perfil Socio Familiar -------------------------------------
const ESTADOS_CIVILES = ['Soltero(a)', 'Casado(a)', 'Unión libre', 'Separado(a)', 'Viudo(a)', 'Divorciado(a)', 'No aplica'];
const NIVELES_ESCOLARES = ['Ninguno', 'Primaria completa', 'Primaria incompleta', 'Secundaria completa', 'Secundaria incompleta', 'Técnico completo', 'Técnico incompleto', 'Universitario completo', 'Universitario incompleto', 'Preescolar', 'Otro'];
const ROLES_FAMILIA = ['Cónyuge o compañero(a) (sin hijos)', 'Madre, padre, cuidadora/or', 'Hija(o), hijastra(o)', 'Hermana(o), hermanastra(o)', 'Sobrina(o), tía(o), prima(o), cuñada(o)', 'Abuela(o)/suegra(o)', 'Nuera/yerno', 'Nieto/a', 'Otra(o) pariente', 'No-pariente'];
const AFILIACIONES_SALUD = ['Subsidiado', 'Contributivo', 'Prepagada', 'Sin afiliación'];
const OCUPACIONES = ['Estudiante', 'Desescolarizado', 'Desempleado(a)', 'Rentista/pensionado(a)', 'Actividades de cuidado en el hogar', 'Empleado(a)', 'Independiente formal', 'Independiente informal', 'No activo(a): bebé menor de 5 años / persona con discapacidad'];
const TIEMPOS_DEDICACION = ['Permanente', 'Temporal', 'Eventual'];

const INGRESO_OPCIONES = ['Menos de un salario mínimo', '1 s.m.', '2 s.m.', '3 a 4 s.m.', '5 o más s.m.', 'No sabe / no informa'];
const INGRESO_TAGS = ['ingresoMenosSmX', 'ingreso1SmX', 'ingreso2SmX', 'ingreso3a4SmX', 'ingreso5MasSmX', 'ingresoNoSabeX'];
const VIVIENDA_OPCIONES = ['Propia', 'Familiar', 'En arriendo', 'Usufructo', 'Inquilinato', 'Refugio temporal', 'Paga diario', 'No sabe / no informa'];
const VIVIENDA_TAGS = ['viviendaPropiaX', 'viviendaFamiliarX', 'viviendaArriendoX', 'viviendaUsufructoX', 'viviendaInquilinatoX', 'viviendaRefugioX', 'viviendaPagaDiarioX', 'viviendaNoSabeX'];
const TRAYECTORIA_SERVICIOS = ['Ninguna', 'Defensoría de Familia', 'Comisaría de Familia', 'Salud', 'Educación', 'Profesional particular', 'Juzgado', 'Organización Comunitaria', 'Alcaldía local', 'ONG', 'Agencia Internacional', 'Policía', 'Medicina Legal', 'Fiscalía', 'Otra'];
const TRAYECTORIA_TAGS = ['trNingunaX', 'trDefensoriaX', 'trComisariaX', 'trSaludX', 'trEducacionX', 'trProfesionalX', 'trJuzgadoX', 'trOrganizacionX', 'trAlcaldiaX', 'trOngX', 'trAgenciaX', 'trPoliciaX', 'trMedicinaX', 'trFiscaliaX', 'trOtraX'];
const EVENTOS_SIGNIFICATIVOS = ['Violencia intrafamiliar', 'Abuso de SPA', 'Enfermedades', 'Conflicto con la ley de algún integrante', 'Accidentes graves', 'Desplazamiento forzado', 'Muerte de algún integrante', 'Amenazas', 'Rupturas, pérdidas o abandonos', 'Migración', 'Conflictos de pareja', 'Abuso sexual', 'Relacionados con la salud mental', 'Desempleo', 'Alcoholismo', 'Otros'];

const NOMBRES_INTEGRANTE = ['Carlos', 'María', 'José', 'Luz', 'Andrés', 'Paula', 'Miguel', 'Sara', 'Daniel', 'Valentina', 'Santiago', 'Isabella'];
const APELLIDOS = ['Restrepo', 'Osorio', 'Zapata', 'Gómez', 'Vélez', 'Correa', 'Muñoz', 'Ceballos', 'Loaiza', 'Mena', 'Higuita', 'Ospina'];

function nuevoIntegrante(rolForzado) {
  return {
    nombre: `${pick(NOMBRES_INTEGRANTE)} ${pick(APELLIDOS)}`,
    edad: String(2 + Math.floor(Math.random() * 60)),
    lugarNacimiento: pick(['Medellín', 'Bello', 'Itagüí', 'Rionegro', 'Apartadó', 'Turbo', 'Andes']),
    estadoCivil: pick(ESTADOS_CIVILES),
    nivelEscolar: pick(NIVELES_ESCOLARES),
    rolFamilia: rolForzado || pick(ROLES_FAMILIA),
    afiliacionSalud: pick(AFILIACIONES_SALUD),
    ocupacion: pick(OCUPACIONES),
    dedicacion: pick(TIEMPOS_DEDICACION),
  };
}

function tagsUnaOpcion(opciones, tags, indiceElegido) {
  const obj = {};
  tags.forEach((tag, i) => { obj[tag] = marcado(i === indiceElegido); });
  return obj;
}

function tagsMultiples(servicios, tags, seleccion) {
  const obj = {};
  servicios.forEach((s, i) => { obj[tags[i]] = marcado(seleccion.has(s)); });
  return obj;
}

export function generarFamiliaYF7(perfil, caso, profesional, hoy, itemsCompromisos) {
  const nIntegrantes = perfil.modo === 'extremo_bajo' ? 5 : perfil.modo === 'extremo_alto' ? 3 : 4;
  const integrantesTabla = [nuevoIntegrante('Madre, padre, cuidadora/or')];
  for (let i = 1; i < nIntegrantes; i += 1) integrantesTabla.push(nuevoIntegrante());
  const integrantesConId = integrantesTabla.map((it) => ({ ...it, id: idLocal() }));
  const integrantesSinId = integrantesTabla;

  const ingresoIdx = perfil.modo === 'extremo_bajo' ? 0 : perfil.modo === 'extremo_alto' ? 3 : perfil.modo === 'atipico' ? Math.floor(Math.random() * 5) : 1 + Math.floor(Math.random() * 2);
  const viviendaIdx = perfil.modo === 'extremo_bajo' ? pick([2, 4]) : perfil.modo === 'extremo_alto' ? 0 : pick([0, 1, 2]);

  const nEventos = perfil.modo === 'extremo_bajo' ? 4 + Math.floor(Math.random() * 2) : perfil.modo === 'extremo_alto' ? 0 : perfil.modo === 'atipico' ? 3 : 1;
  const eventosElegidos = new Set(nEventos > 0 ? pickAlgunos(EVENTOS_SIGNIFICATIVOS.slice(0, -1), nEventos, nEventos) : []);

  const nTrayectoria = perfil.modo === 'extremo_bajo' ? 3 : perfil.modo === 'extremo_alto' ? 1 : 2;
  const trayectoriaElegida = new Set(pickAlgunos(TRAYECTORIA_SERVICIOS.slice(1, -1), nTrayectoria, nTrayectoria));

  const acudenPropia = perfil.t >= 0.3;
  const subsidiosSi = perfil.modo === 'extremo_bajo' || perfil.modo === 'intermedio_tension';

  const datos = {
    fecha: fechaDDMMAAAA(hoy),
    regional: 'Antioquia',
    centroZonal: profesional.centroZonal,
    numPeticion: caso.numeroPeticion,
    profesionales: profesional.nombre,
    nombreParticipante: caso.nombre,
    tipoDocumento: 'CC',
    rolParticipante: pick(ROLES_FAMILIA),
    participantesEncuentro: `${caso.nombre}, acudiente`,
    direccion: `Calle ${10 + Math.floor(Math.random() * 80)} # ${5 + Math.floor(Math.random() * 40)}-${10 + Math.floor(Math.random() * 80)}`,
    barrio: pick(['Centro', 'San José', 'La Paz', 'El Progreso', 'Villa Nueva', 'Las Flores']),
    municipio: caso.municipio,
    telefono: `3${Math.floor(100000000 + Math.random() * 899999999)}`,
    numAportantes: String(perfil.modo === 'extremo_bajo' ? 1 : 2),
    subsidiosCual: subsidiosSi ? 'Familias en Acción' : '',
    relatoFamilia: 'Familia que llega al servicio en el marco de la ruta de vinculación institucional, referida por el equipo territorial.',
    familiaExtensa: perfil.modo === 'extremo_bajo' ? 'Cuenta con apoyo limitado de familia extensa' : 'Cuenta con apoyo de familia extensa cercana',
    otrasPersonas: '',
    hijosUnionActual: String(Math.max(0, nIntegrantes - 2)),
    hijosUnionAnterior: '0',
    ellaNum: String(1 + Math.floor(Math.random() * 3)),
    elNum: String(Math.floor(Math.random() * 2)),
    procesosCuales: perfil.modo === 'extremo_bajo' ? 'Proceso administrativo de restablecimiento de derechos' : '',
    modalidadIcbf: 'Presencia para la Convivencia y el Fortalecimiento de Vínculos Familiares y Comunitarios',
    ipOtroCual: '',
    trOtraCual: '',
    aspiracionesTexto: 'Estabilidad económica; continuidad educativa de los hijos | Expectativa: Fortalecer la convivencia familiar durante el acompañamiento.',
    conclusionesTexto: 'Familia con disposición al acompañamiento | Conclusión: Se identifican fortalezas y oportunidades a trabajar en las siguientes fases del servicio.',
    acuerdosTexto: `${pickAlgunos(COMPROMISOS_FAMILIA_TXT, 1, 2).join('; ')} | Acuerdos: Continuar el proceso de acompañamiento | Matriz: ${matrizCompromisos(itemsCompromisos)} | Ruta: Seguimiento por el equipo psicosocial del Centro Zonal.`,
    ev16Detalle: eventosElegidos.has('Otros') ? 'Situación puntual referida por la familia' : '',

    acudenPropiaMarca: marcado(acudenPropia), acudenRemitidosMarca: marcado(!acudenPropia),
    subsidiosSiMarca: marcado(subsidiosSi), subsidiosNoMarca: marcado(!subsidiosSi), subsidiosNoInformaMarca: '',
    padreX: marcado(perfil.modo !== 'extremo_bajo'), madreX: 'X',
    procesosSiMarca: marcado(perfil.modo === 'extremo_bajo'), procesosNoMarca: marcado(perfil.modo !== 'extremo_bajo'),
    vsAmigosX: marcado(perfil.t >= 0.3), vsVecinosX: marcado(perfil.t >= 0.4), vsGruposX: marcado(perfil.t >= 0.7), vsFamiliaX: 'X',
    ipSaludX: marcado(trayectoriaElegida.has('Salud')), ipJusticiaX: marcado(trayectoriaElegida.has('Juzgado') || trayectoriaElegida.has('Comisaría de Familia')), ipIglesiaX: marcado(perfil.t >= 0.5), ipOtroX: '',
    ocEstudioX: marcado(perfil.t >= 0.4), ocTrabajoX: marcado(perfil.t >= 0.3),

    ...tagsUnaOpcion(INGRESO_OPCIONES, INGRESO_TAGS, ingresoIdx),
    ...tagsUnaOpcion(VIVIENDA_OPCIONES, VIVIENDA_TAGS, viviendaIdx),
    ...tagsMultiples(TRAYECTORIA_SERVICIOS, TRAYECTORIA_TAGS, trayectoriaElegida.size ? trayectoriaElegida : new Set(['Ninguna'])),
    integrantes: integrantesSinId,
  };
  EVENTOS_SIGNIFICATIVOS.forEach((_, i) => { datos[`ev${i + 1}X`] = marcado(eventosElegidos.has(EVENTOS_SIGNIFICATIVOS[i])); });

  return { datos, familiaIntegrantes: integrantesConId };
}

// --- F8 · Cronograma de Visitas y Encuentros ------------------------------
export function generarF8(caso, profesional, hoy) {
  const familiar = [];
  const nVisitas = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < nVisitas; i += 1) {
    const f = fechaHaceDias(-7 * (i + 1));
    familiar.push({
      num: String(i + 1),
      fecha: fechaISO(f),
      inicio: `0${8 + i}:00`,
      fin: `0${9 + i}:30`,
      nombre: caso.nombre,
      cedula: String(1_000_000_000 + Math.floor(Math.random() * 100_000_000)),
      telefono: `3${Math.floor(100000000 + Math.random() * 899999999)}`,
      direccion: `Calle ${10 + Math.floor(Math.random() * 80)} # ${5 + Math.floor(Math.random() * 40)}-${10 + Math.floor(Math.random() * 80)}`,
      municipio: caso.municipio,
      comuna: '',
      barrio: pick(['Centro', 'San José', 'La Paz', 'El Progreso']),
      vereda: '',
      referencia: 'Cerca al parque principal',
      observaciones: '',
    });
  }
  const comunitario = [{
    num: '1',
    fecha: fechaISO(fechaHaceDias(-21)),
    inicio: '09:00',
    fin: '11:00',
    familias: String(8 + Math.floor(Math.random() * 8)),
    lugar: 'Salón comunal',
    municipio: caso.municipio,
    comuna: '',
    barrio: pick(['Centro', 'San José', 'La Paz']),
    vereda: '',
    referencia: '',
    observaciones: '',
  }];
  return {
    regional: 'Antioquia',
    centroZonal: profesional.centroZonal,
    profesional: profesional.nombre,
    telefono: `3${Math.floor(100000000 + Math.random() * 899999999)}`,
    familiar,
    comunitario,
  };
}

// F8Cronograma.jsx guarda en Supabase las fechas ya en DD/MM/AAAA (igual
// que el resto de formatos), pero escribe el .xlsx a partir del estado
// local en AAAA-MM-DD crudo (formatoFecha() se aplica recién al escribir la
// celda) — por eso hacen falta dos versiones de `datos`: la que devuelve
// generarF8() (fechas AAAA-MM-DD, para renderF8Xlsx) y esta, para el insert
// en formatos_oficiales_datos.
export function datosF8ParaGuardar(datos) {
  return {
    ...datos,
    familiar: datos.familiar.map((f) => ({ ...f, fecha: formatoFecha(f.fecha) })),
    comunitario: datos.comunitario.map((c) => ({ ...c, fecha: formatoFecha(c.fecha) })),
  };
}

// --- F10 · Seguimiento Uso Adecuado del Recurso ---------------------------
const CATEGORIAS_DISCAPACIDAD = ['Física', 'Visual', 'Auditiva', 'Sordoceguera', 'Psicosocial', 'Intelectual', 'Múltiple'];
const CAT_KEYS = ['catFisica', 'catVisual', 'catAuditiva', 'catSordoceguera', 'catPsicosocial', 'catIntelectual', 'catMultiple'];
const SOPORTES = ['Factura', 'Recibo de caja', 'Recibo de servicios públicos', 'Comprobante de pago', 'Cotización'];
const ESTABLECIMIENTOS = ['Supermercado La Economía', 'Droguería Central', 'Papelería El Estudiante', 'Almacén de Calzado', 'EPM', 'Farmatodo'];
const DETALLES_COMPRA = ['Mercado del mes', 'Elementos de aseo', 'Útiles escolares', 'Medicamentos', 'Vestuario', 'Pago de servicio público'];

export function generarF10(perfil, caso, profesional, hoy) {
  const nFilas = 3 + Math.floor(Math.random() * 4);
  const compras = [];
  for (let i = 0; i < nFilas; i += 1) {
    compras.push({ fecha: fechaDDMMAAAA(fechaHaceDias(i * 5)), soporte: pick(SOPORTES), establecimiento: pick(ESTABLECIMIENTOS), detalle: pick(DETALLES_COMPRA), valor: 20000 + Math.floor(Math.random() * 180000) });
  }
  const total = compras.reduce((s, c) => s + c.valor, 0);
  const catElegidas = new Set(perfil.fqolAplicaDiscapacidad ? pickAlgunos(CATEGORIAS_DISCAPACIDAD, 1, 2) : []);

  const datos = {
    fecha: fechaDDMMAAAA(hoy),
    numSolicitud: `${caso.numeroPeticion}`,
    centroZonal: profesional.centroZonal,
    responsable: profesional.nombre,
    titularCuenta: caso.nombre,
    nombreParticipante: caso.nombre,
    coordinador: 'Coordinación Centro Zonal',
    profesionales: profesional.nombre,
    totalInvertido: MONEY(total),
    saldoPendiente: MONEY(Math.max(0, 400000 - total)),
  };
  CATEGORIAS_DISCAPACIDAD.forEach((c, i) => { datos[CAT_KEYS[i]] = marcadoUnicode(catElegidas.has(c)); });
  for (let i = 0; i < 8; i += 1) {
    const c = compras[i];
    datos[`fila${i + 1}Fecha`] = c ? c.fecha : '';
    datos[`fila${i + 1}Soporte`] = c ? c.soporte : '';
    datos[`fila${i + 1}Establecimiento`] = c ? c.establecimiento : '';
    datos[`fila${i + 1}Detalle`] = c ? c.detalle : '';
    datos[`fila${i + 1}Valor`] = c ? MONEY(c.valor) : '';
  }
  return datos;
}
