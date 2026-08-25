// F5 · Encuentros Comunitarios de Cuidado — datos para `encuentros_comunitarios`
// (tabla propia desde la migración 0003, no `formatos_oficiales_datos`) y
// para el .docx oficial (mismo shape, ver spec-formatos.md).
import { pick, pickAlgunos, fechaDDMMAAAA, fechaISO, fechaHaceDias } from './utilFormatos.mjs';

const METODOLOGIAS = ['Diálogos para el Cuidado y el Buen Vivir', 'Círculos de palabra', 'Taller vivencial', 'Cartografía social', 'Juego de roles', 'Cine foro comunitario'];
const OBJETIVOS = ['Fortalecer la red de apoyo comunitaria', 'Promover pautas de crianza sin violencia', 'Prevenir la violencia intrafamiliar', 'Fortalecer la corresponsabilidad familiar y comunitaria', 'Reconocer rutas de atención institucional disponibles'];
const ACTIVIDADES = ['Bienvenida y encuadre', 'Dinámica de integración', 'Círculo de palabra', 'Trabajo en subgrupos', 'Plenaria y conclusiones', 'Evaluación participativa del encuentro'];
const LOGROS = ['Alta participación de las familias convocadas', 'Reconocimiento de redes de apoyo disponibles', 'Fortalecimiento del vínculo comunitario', 'Identificación conjunta de rutas institucionales'];
const ACIERTOS = ['Buena convocatoria previa', 'Metodología adecuada al grupo', 'Espacio físico apropiado', 'Participación activa de líderes comunitarios'];
const BARRERAS = ['Dificultades de transporte de algunas familias', 'Clima adverso el día del encuentro', 'Baja disponibilidad de tiempo de las familias', 'Espacio físico limitado'];
const MEJORAS = ['Ampliar la convocatoria con mayor anticipación', 'Gestionar un espacio más amplio', 'Articular transporte para familias distantes', 'Programar en horario alterno'];

export function generarF5(profesional, casoNombre, hoy) {
  const fecha = fechaHaceDias(3);
  const logros = pickAlgunos(LOGROS, 1, 2);
  const aciertos = pickAlgunos(ACIERTOS, 1, 2);
  const datos = {
    fecha: fechaDDMMAAAA(fecha),
    regional: 'Antioquia',
    centroZonal: profesional.centroZonal,
    equipo: profesional.nombre,
    numFamilias: String(8 + Math.floor(Math.random() * 8)),
    lugar: 'Salón comunal del barrio',
    metodologia: pick(METODOLOGIAS),
    objetivo: pick(OBJETIVOS),
    actividades: pickAlgunos(ACTIVIDADES, 3, 5).join('; '),
    logrosYAciertos: `Logros: ${logros.join('; ')} | Aciertos: ${aciertos.join('; ')}`,
    barreras: pickAlgunos(BARRERAS, 1, 2).join('; '),
    oportunidadesMejora: pickAlgunos(MEJORAS, 1, 2).join('; '),
  };
  return { fecha, datos };
}
