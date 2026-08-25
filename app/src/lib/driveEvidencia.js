// Respaldo automático en Drive: cada formato oficial, al guardarse, sube
// el .docx/.xlsx recién generado a la función `drive-storage` (ver
// supabase/functions/drive-storage). Es un respaldo silencioso — si
// falla (sin sesión, sin internet, Drive caído), NUNCA debe impedir que
// el formato quede guardado en Supabase ni que el usuario reciba su
// descarga local, así que nunca lanza: solo registra el error en consola.
import { supabase } from './supabaseClient.js';

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// `fase` es la etiqueta de la etapa (ej. "02 · Comprensión y Planificación
// Familiar") — así las evidencias quedan agrupadas en Drive tal como
// avanza el servicio, no por código de formato suelto. `codigoAcceso` solo
// hace falta para un invitado sin sesión (beneficiario o cuenta que aún
// no tiene) — con sesión, drive-storage ya identifica el caso por el JWT
// y este parámetro se ignora.
export async function respaldarEnDrive({ casoId, fase, fileName, mimeType, blob, codigoAcceso }) {
  if (!casoId || !blob) return;
  try {
    const contentBase64 = await blobToBase64(blob);
    const { error } = await supabase.functions.invoke('drive-storage', {
      body: { action: 'upload', casoId, fase, fileName, mimeType, contentBase64, codigoAcceso },
    });
    if (error) console.error('No se pudo respaldar en Drive:', error);
  } catch (err) {
    console.error('No se pudo respaldar en Drive:', err);
  }
}
