import { supabase } from './supabaseClient.js';

// F5 (Encuentros Comunitarios) ya no es una fila 1:1 con un solo caso: un
// mismo encuentro lo diligencia el profesional una sola vez y lo asisten
// varios beneficiarios a la vez (ver 0003_roles_bolsa_asignacion.sql,
// tablas encuentros_comunitarios / encuentro_participantes). `casoIds` son
// los casos propios del profesional marcados en el formulario — la RLS de
// encuentro_participantes además exige que cada uno esté realmente
// asignado a quien llama, como defensa adicional a lo que ya filtra la
// interfaz.
export async function guardarEncuentroComunitario({ userId, fecha, datos, casoIds }) {
  const { data: encuentro, error } = await supabase
    .from('encuentros_comunitarios')
    .insert({ realizado_por: userId, fecha: fecha || null, datos })
    .select()
    .single();
  if (error) throw error;

  if (casoIds && casoIds.length) {
    const filas = casoIds.map((casoId) => ({ encuentro_id: encuentro.id, caso_id: casoId }));
    const { error: errorParticipantes } = await supabase.from('encuentro_participantes').insert(filas);
    if (errorParticipantes) throw errorParticipantes;
  }

  return encuentro;
}
