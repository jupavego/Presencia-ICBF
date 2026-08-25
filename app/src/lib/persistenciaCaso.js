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

// Trae el `datos` del diligenciamiento más reciente de un formato para el
// caso activo — para que el formulario se abra con lo último guardado en
// vez de en blanco cada vez (hay historial, no upsert, así que puede haber
// varias filas por formato: se toma la de `actualizado_en` más reciente).
// Solo para staff con sesión — la RLS de formatos_oficiales_datos exige
// `casos.asignado_a = auth.uid()` o admin; el beneficiario anónimo (sin
// sesión) usa obtenerUltimoFormatoBeneficiario en persistenciaBeneficiario.js.
export async function obtenerUltimoFormatoOficial(casoId, formatoKey) {
  if (!casoId) return null;
  const { data, error } = await supabase
    .from('formatos_oficiales_datos')
    .select('datos')
    .eq('caso_id', casoId)
    .eq('formato_key', formatoKey)
    .order('actualizado_en', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error(`No se pudo cargar el último ${formatoKey} guardado:`, error);
    return null;
  }
  return data?.datos ?? null;
}
