// Estructura del servicio Presencia: etapas oficiales (arquitectura operativa
// ajustada) y los formatos/instrumentos que intervienen en cada una.
//
// Cada formato vive en UNA sola etapa (la de su primer uso), para no duplicar
// tarjetas cuando el mismo instrumento se reutiliza más adelante en el proceso.
// No se listan etapas sin formatos propios: cuando una etapa no aporta un
// instrumento distinto, su alcance se fusiona con la etapa que sí lo tiene
// (ver etapa 03, que cubre tanto el inicio como la continuidad del
// acompañamiento).
//
// `componentKey` referencia un componente registrado en
// src/components/formats/registry.js. Cuando un formato aún no tiene
// componente, se deja en null y queda marcado como "pendiente"/"borrador".

export const ETAPAS = [
  {
    code: '01',
    nombre: 'Acceso y Admisión',
    proposito: 'Recibir, caracterizar y activar la solicitud de la familia en el Sistema de Información Oficial del ICBF.',
    funciones: ['Registro de solicitud', 'Caracterización inicial', 'Clasificación y direccionamiento', 'Validación y activación', 'Asignación del caso'],
    formatos: [
      {
        codigo: 'PET',
        nombre: 'Petición de Vinculación al Servicio',
        desc: 'Formato propio de la plataforma: cómo llega la familia, quién solicita el acompañamiento, su territorio, condiciones de contexto, pertenencia y motivo del contacto, con una orientación inicial hacia la etapa de Comprensión.',
        estado: 'disponible',
        componentKey: 'PETICION',
      },
    ],
  },
  {
    code: '02',
    nombre: 'Comprensión Familiar',
    proposito: 'Comprender el contexto, las capacidades, necesidades y redes de apoyo de la familia.',
    funciones: ['Perfil sociofamiliar', 'Contexto y situación', 'Capacidades y recursos', 'Necesidades', 'Redes y apoyos', 'Lectura ecosistémica', 'Riesgos y alertas'],
    formatos: [
      { codigo: 'F7', nombre: 'Perfil Socio Familiar', codigoOficial: 'F7.GO3.MT5.PP v2', desc: 'Caracterización y perfil de la familia y su contexto. F7.GO3.MT5.PP v2.', estado: 'disponible', componentKey: 'F7' },
    ],
  },
  {
    code: '03',
    nombre: 'Acompañamiento',
    proposito: 'Desarrollar y sostener en el tiempo las formas de acompañamiento —diálogos para el cuidado y el buen vivir, encuentros comunitarios y acompañamiento en el entorno familiar—, ejecutando actividades, fortaleciendo capacidades y ajustando el plan según las necesidades de la familia, desde el primer encuentro hasta el cierre.',
    funciones: ['Diálogos para el cuidado y el buen vivir', 'Encuentros comunitarios de cuidado', 'Acompañamiento en el entorno familiar', 'Movilización de redes de apoyo', 'Registro recurrente de encuentros y visitas', 'Ajustes al plan y fortalecimiento de capacidades'],
    formatos: [
      { codigo: 'F1', nombre: 'Mapa de Pertenencia Actual y Potencial', codigoOficial: 'F1.GO3.MT5.PP v1', desc: 'Cartografía de redes de apoyo familiares y comunitarias, en cuatro ámbitos y tres círculos de cercanía. Se abre aquí y se sigue actualizando durante todo el acompañamiento. F1.GO3.MT5.PP v1.', estado: 'disponible', componentKey: 'F1' },
      { codigo: 'F5', nombre: 'Encuentros Comunitarios de Cuidado', codigoOficial: 'F5.GO3.MT5.PP v2', desc: 'Registro y catálogo del encuentro comunitario. Se usa para cada encuentro, de manera recurrente mientras dure el acompañamiento. F5.GO3.MT5.PP v2.', estado: 'disponible', componentKey: 'F5' },
      { codigo: 'F6', nombre: 'Acompañamiento en el Entorno Familiar', codigoOficial: 'F6.GO3.MT5.PP v2', desc: 'Registro estructurado de la visita o encuentro en el entorno familiar. Se usa para cada visita, de manera recurrente mientras dure el acompañamiento. F6.GO3.MT5.PP v2.', estado: 'disponible', componentKey: 'F6' },
    ],
  },
  {
    code: '04',
    nombre: 'Planificación y Agenda',
    proposito: 'Construir objetivos, acuerdos y programar las actividades del acompañamiento con la familia.',
    funciones: ['Definición de objetivos', 'Acuerdos y compromisos', 'Plan de actividades', 'Cronograma de visitas y encuentros', 'Asignación de responsables'],
    formatos: [
      { codigo: 'F3', nombre: 'Acuerdo de Vinculación', codigoOficial: 'F3.GO3.MT5.PP v2', desc: 'Formalización del acuerdo de vinculación de la familia al servicio, tratamiento de datos y uso de imagen. F3.GO3.MT5.PP v2.', estado: 'disponible', componentKey: 'F3' },
      { codigo: 'F8', nombre: 'Cronograma de Visitas y Encuentros', codigoOficial: 'F8.GO3.MT5.PP v2', desc: 'Programación mensual de visitas al entorno familiar y encuentros comunitarios. F8.GO3.MT5.PP v2.', estado: 'disponible', componentKey: 'F8' },
    ],
  },
  {
    code: '05',
    nombre: 'Seguimiento',
    proposito: 'Revisar avances, el uso adecuado del recurso entregado a la familia y tomar decisiones oportunas.',
    funciones: ['Seguimiento a avances', 'Seguimiento al uso adecuado del recurso', 'Alertas y dificultades', 'Toma de decisiones', 'Reportes operativos'],
    formatos: [
      { codigo: 'F10', nombre: 'Seguimiento Uso Adecuado del Recurso', codigoOficial: 'F10.GO3.MT5.PP v2', desc: 'Control y verificación de la inversión del apoyo económico entregado a la familia. F10.GO3.MT5.PP v2.', estado: 'disponible', componentKey: 'F10' },
      { codigo: 'SIO', nombre: 'Registro de seguimiento', desc: 'Actualización del caso y sus avances en el Sistema de Información Oficial.', estado: 'pendiente', componentKey: null, nota: 'Actuación en el sistema misional del ICBF; no cuenta con formato propio.' },
    ],
  },
  {
    code: '06',
    nombre: 'Valoración y Cierre',
    proposito: 'Valorar los cambios logrados, la satisfacción de la familia y formalizar el cierre del proceso.',
    funciones: ['Encuesta de satisfacción', 'Reconocer logros y aprendizajes', 'Formalizar el cierre', 'Registro final en el sistema oficial'],
    formatos: [
      { codigo: 'F4', nombre: 'Encuesta de Satisfacción', codigoOficial: 'F4.GO3.MT5.PP v2', desc: 'Percepción de la familia sobre el servicio Presencia recibido. F4.GO3.MT5.PP v2.', estado: 'disponible', componentKey: 'F4' },
      { codigo: 'SIO', nombre: 'Registro final', desc: 'Cierre formal del caso en el Sistema de Información Oficial.', estado: 'pendiente', componentKey: null, nota: 'Actuación en el sistema misional del ICBF; no cuenta con formato propio.' },
    ],
  },
];

// Ubica automáticamente en qué etapa vive un formato, a partir de su
// `componentKey`. Se usa para construir el encabezado de cada formulario
// (etapa + nombre) sin tener que repetir esos datos dentro de cada
// componente de formato — así una etapa nunca queda desincronizada.
export function findEtapaByComponentKey(componentKey) {
  for (const etapa of ETAPAS) {
    if (etapa.formatos.some((f) => f.componentKey === componentKey)) {
      return { code: etapa.code, nombre: etapa.nombre };
    }
  }
  return null;
}

// Cuenta solo los formatos ya digitalizados (estado 'disponible') de una
// etapa. Se usa en el menú y en el encabezado de la etapa para no mezclar
// formatos disponibles con los que todavía están pendientes.
export function countDisponibles(etapa) {
  return etapa.formatos.filter((f) => f.estado === 'disponible').length;
}
