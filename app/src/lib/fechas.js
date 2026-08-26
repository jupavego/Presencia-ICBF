// Formatea una fecha ISO (yyyy-mm-dd, tal como la entregan los <input type="date">)
// a dd/mm/aaaa, el formato que usan todos los formatos oficiales del servicio.
//
// Vive separado de exportOficial.js (que trae docxtemplater+exceljs+pizzip,
// solo necesarios al generar un documento) porque también se usa en vistas
// que se cargan siempre (PerfilSesionPanel, UsuariosTrazabilidad) — importar
// esto desde exportOficial.js arrastraba esas tres librerías pesadas al
// bundle inicial para cualquier visitante, aunque nunca exportara nada.
export function formatoFecha(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}
