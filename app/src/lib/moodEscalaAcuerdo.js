// Detecta el sentimiento de una opción de escala de acuerdo/desacuerdo
// (BFI-2, MSPSS, McMaster FAD, FRAS-54, y cualquier instrumento futuro
// con el mismo tipo de respuesta) por palabras clave en la etiqueta, no
// por posición ni valor — así funciona igual sin importar si la escala va
// de menor a mayor acuerdo o al revés (McMaster FAD la invierte). No se
// aplica a otros tipos de respuesta (Frecuencia, Presencia, Sí/No, etc.):
// si la etiqueta no coincide con ningún patrón, no devuelve nada y
// Choice.jsx no renderiza ícono. Ver MoodIcon.jsx para el ícono en sí.
export function moodParaOpcion(etiqueta) {
  const t = etiqueta.toLowerCase();
  const esDesacuerdo = /desacuerdo/.test(t);
  const esAcuerdo = !esDesacuerdo && /acuerdo/.test(t);
  const intensa = /muy|totalmente|fuerte/.test(t);

  if (esDesacuerdo) return intensa ? 'fuerte-desacuerdo' : 'desacuerdo';
  if (esAcuerdo) return intensa ? 'fuerte-acuerdo' : 'acuerdo';
  if (/neutral|indiferente|sin opini[oó]n/.test(t)) return 'neutral';
  return null;
}
