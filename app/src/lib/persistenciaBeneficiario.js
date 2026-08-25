import { supabase } from './supabaseClient.js';

// Guardado sin sesión, para un beneficiario que retoma su caso con el
// código de acceso (ver CasoContext.jsx / RetomarCasoScreen.jsx). La RLS
// no le da a `anon` ningún acceso directo a formatos_oficiales_datos ni a
// perfilamiento_resultados — todo pasa por estas funciones `security
// definer` de 0003_roles_bolsa_asignacion.sql, que validan el código antes
// de escribir. No lanza si falla, mismo contrato que
// guardarDatosFormatoOficial en persistenciaCaso.js: quien llama decide
// cómo avisar, la descarga del documento no debe bloquearse.
export async function guardarFormatoBeneficiario(codigoAcceso, formatoKey, datos) {
  if (!codigoAcceso) return { guardado: false, motivo: 'sin_codigo_acceso' };
  const { error } = await supabase.rpc('guardar_formato_beneficiario', {
    p_codigo: codigoAcceso,
    p_formato_key: formatoKey,
    p_datos: datos,
  });
  if (error) {
    console.error(`No se pudo guardar ${formatoKey} como beneficiario:`, error);
    return { guardado: false, motivo: 'error_servidor', error };
  }
  return { guardado: true };
}

export async function obtenerPerfilamientoBeneficiario(codigoAcceso) {
  if (!codigoAcceso) return [];
  const { data, error } = await supabase.rpc('obtener_perfilamiento_por_codigo', { p_codigo: codigoAcceso });
  if (error) {
    console.error('No se pudo cargar el perfil de sesión guardado (beneficiario):', error);
    return [];
  }
  return data || [];
}

export async function guardarPerfilamientoBeneficiario(codigoAcceso, instrumentoId, resultado) {
  if (!codigoAcceso) return { guardado: false, motivo: 'sin_codigo_acceso' };
  const { error } = await supabase.rpc('guardar_perfilamiento_beneficiario', {
    p_codigo: codigoAcceso,
    p_instrumento_id: instrumentoId,
    p_resultado: resultado,
  });
  if (error) {
    console.error(`No se pudo guardar el resultado de ${instrumentoId} como beneficiario:`, error);
    return { guardado: false, motivo: 'error_servidor', error };
  }
  return { guardado: true };
}
