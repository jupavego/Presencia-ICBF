// Helpers compartidos para reabrir un formato oficial con lo último
// guardado (ver hooks/useUltimoFormatoOficial.js). El objeto `datos` que
// arma cada formato está pensado para rellenar el .docx/.xlsx oficial, no
// para reconstruir de vuelta el estado del formulario — así que estas
// funciones son el camino inverso, "mejor esfuerzo": cuando el dato
// guardado no encaja limpio con el control original (ej. una opción "Otro"
// con texto libre ya sustituido, o un campo compuesto como
// "motivo. descripción"), se deja ese control vacío en vez de adivinar.

// DD/MM/AAAA (formatoFecha, exportOficial.js) -> AAAA-MM-DD (lo que espera
// el value de un <input type="date">).
export function ddmmaaaaAIso(texto) {
  if (!texto) return '';
  const [d, m, y] = String(texto).split('/');
  if (!d || !m || !y) return '';
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

// Reconstruye la selección de un CheckboxGrid a partir de un string
// "opción1; opción2; opción3" (el join('; ') que arma cada formato) — solo
// marca las opciones que coinciden EXACTO con la lista de opciones válidas;
// una opción "Otro/a" ya sustituida por su texto libre no coincide con
// ninguna, así que simplemente no queda marcada (no hay forma de
// distinguir "no se marcó" de "se marcó Otro con este texto" solo a partir
// del string ya combinado).
export function reconstruirChecklist(textoJoined, opcionesValidas) {
  if (!textoJoined) return [];
  const partes = String(textoJoined).split(';').map((v) => v.trim());
  return partes.filter((v) => opcionesValidas.includes(v));
}

// "1.234.567,89" (es-CO, MONEY() en F10SeguimientoRecurso.jsx) -> "1234567.89"
// (lo que espera un <input type="number">).
export function moneyAJsNumero(texto) {
  if (!texto) return '';
  const normalizado = String(texto).replace(/\./g, '').replace(',', '.');
  const n = Number(normalizado);
  return Number.isFinite(n) ? String(n) : '';
}
