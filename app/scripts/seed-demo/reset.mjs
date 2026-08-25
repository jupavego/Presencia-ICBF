// Deshace todo lo sembrado por seed-demo.mjs, identificando los datos demo
// por sus marcas (ver perfiles.mjs): cuentas ICBF con correo terminado en
// DOMINIO_DEMO, casos con numero_peticion que empieza por PREFIJO_DEMO.
// Orden importante: hay FKs sin `on delete cascade` desde `casos`/
// `encuentros_comunitarios` hacia `auth.users` (asignado_a/realizado_por) —
// hay que borrar lo que referencia a un usuario ANTES de borrar ese
// usuario, o Postgres rechaza el delete por violación de llave foránea.
import { supabaseAdmin } from './supabaseAdmin.mjs';
import { DOMINIO_DEMO, PREFIJO_DEMO } from './perfiles.mjs';

async function listarUsuariosDemo() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  return data.users.filter((u) => u.email?.endsWith(DOMINIO_DEMO));
}

export async function resetDemo() {
  console.log('--- Reset: eliminando datos demo previos (si existen) ---');
  const usuariosDemo = await listarUsuariosDemo();
  const idsDemo = usuariosDemo.map((u) => u.id);

  if (idsDemo.length > 0) {
    const { error: errEncuentros } = await supabaseAdmin.from('encuentros_comunitarios').delete().in('realizado_por', idsDemo);
    if (errEncuentros) throw errEncuentros;
    console.log(`  encuentros_comunitarios de cuentas demo: eliminados`);
  }

  const { error: errCasos } = await supabaseAdmin.from('casos').delete().like('numero_peticion', `${PREFIJO_DEMO}%`);
  if (errCasos) throw errCasos;
  console.log('  casos demo (y en cascada: formatos_oficiales_datos, perfilamiento_resultados, familia_integrantes, compromisos, caso_asignaciones, encuentro_participantes): eliminados');

  for (const u of usuariosDemo) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(u.id);
    if (error) throw error;
  }
  console.log(`  cuentas ICBF demo (${usuariosDemo.length}) y sus profiles: eliminadas`);
  console.log('--- Reset completo ---\n');
}
