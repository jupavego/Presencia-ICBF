// Cliente admin de Supabase para scripts de servidor (nunca en el cliente
// web). Usa SUPABASE_SERVICE_ROLE_KEY, que bypassa RLS por completo — es lo
// que le permite a este script crear cuentas ICBF, sembrar casos y sus
// formatos/herramientas sin depender de una asignación previa.
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { cargarEnv } from './env.mjs';

cargarEnv();

const URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_KEY) {
  console.error(
    'Falta VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en app/.env.\n' +
    'SUPABASE_SERVICE_ROLE_KEY se obtiene en el dashboard de Supabase: ' +
    'Project Settings → API Keys → Secret keys (nunca comitear este archivo).',
  );
  process.exit(1);
}

export const supabaseAdmin = createClient(URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  // Node 20 no trae WebSocket nativo (llega en Node 22) y supabase-js
  // intenta crear su RealtimeClient igual al construir el cliente, aunque
  // este script nunca usa canales realtime — sin esto, createClient() falla
  // al importar. Ver aviso oficial de la librería.
  realtime: { transport: ws },
});
