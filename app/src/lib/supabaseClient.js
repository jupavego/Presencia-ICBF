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

// persistSession/autoRefreshToken ya son el default de supabase-js en
// navegador (localStorage + refresco silencioso del token), pero se
// declaran explícitos para que "mantener sesión iniciada" sea una
// decisión visible del código, no un default implícito.
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
