import { createClient } from '@supabase/supabase-js';

// Cliente único de Supabase para toda la app — backend real (Postgres +
// Auth + API vía PostgREST) sin necesidad de un servidor propio. Las
// credenciales viven en app/.env (nunca comiteado, ver .env.example) y
// nunca en el código: sin ellas, cualquier llamada falla explícitamente
// en vez de apuntar por accidente a un proyecto equivocado.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copie app/.env.example a app/.env y complete las credenciales de su proyecto de Supabase.'
  );
}

export const supabase = createClient(url, anonKey);
