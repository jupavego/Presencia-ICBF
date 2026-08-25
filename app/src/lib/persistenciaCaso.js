import { supabase } from './supabaseClient.js';

// Guarda el mismo objeto `datos` que cada formato oficial (F1-F10) ya
// arma para rellenar su plantilla .docx/.xlsx (ver exportOficial.js),
// asociado al caso activo — así los datos capturados sobreviven a
// recargar la página, además de poder descargarse como documento oficial.
// No lanza si falla: la descarga del documento (el uso principal del
// formato) no debe bloquearse porque el guardado en el servidor falló;
// el llamador decide cómo avisar al usuario con el resultado.
//
// Es un `insert` simple, no un upsert: desde 0003_roles_bolsa_asignacion.sql
// ya no hay una restricción única por (caso_id, formato_key) — cada
// diligenciamiento queda como su propia fila, para conservar historial en
// vez de sobrescribir (ej. varias visitas de F6 sobre el mismo caso). Esta
// función es solo para staff con sesión; el único formato oficial que un
// beneficiario puede diligenciar por su cuenta (F1) usa
// guardarFormatoBeneficiario en persistenciaBeneficiario.js.
export async function guardarDatosFormatoOficial(casoId, formatoKey, datos) {
  if (!casoId) return { guardado: false, motivo: 'sin_caso_activo' };
  const { error } = await supabase
    .from('formatos_oficiales_datos')
    .insert({ caso_id: casoId, formato_key: formatoKey, datos });
  if (error) {
    console.error(`No se pudo guardar ${formatoKey} en el servidor:`, error);
    return { guardado: false, motivo: 'error_servidor', error };
  }
  return { guardado: true };
}
