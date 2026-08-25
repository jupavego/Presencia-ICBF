import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

// Sesión de autenticación de Supabase. Las cuentas de los profesionales
// se siguen creando manualmente desde el dashboard de Supabase
// (Authentication → Users) — no cambia. Lo que sí se agregó es signUp()
// para beneficiarios: marca la cuenta con
// raw_user_meta_data.tipo_cuenta='beneficiario' para que el trigger
// handle_new_user() (0004_beneficiario_autenticado.sql) NO le cree fila
// en `profiles` — así queda autenticado pero nunca indistinguible de
// staff para los chequeos `profile?.rol === '...'` de la app. Ver
// README.md "Configuración de Supabase".
const AuthContext = createContext(null);

// Auto-login de desarrollo: si VITE_DEV_EMAIL/VITE_DEV_PASSWORD están en el
// .env local (nunca se comitean), la app inicia sesión sola al cargar en
// `npm run dev` — para no tener que loguearse a mano cada vez que se abre
// una pestaña nueva del navegador durante el desarrollo. `import.meta.env.DEV`
// es reemplazado por Vite en tiempo de build; en `npm run build` queda en
// `false` y este bloque se elimina del bundle de producción por completo.
const DEV_EMAIL = import.meta.env.VITE_DEV_EMAIL;
const DEV_PASSWORD = import.meta.env.VITE_DEV_PASSWORD;

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = cargando, null = sin sesión
  const [profile, setProfile] = useState(null); // fila de `profiles` (rol, nombre, centro_zonal) — null si no hay sesión
  const autoLoginIntentado = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      setSession(nuevaSesion);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // El rol (profesional_icbf/admin) vive en `profiles`, no en la sesión de
  // Supabase Auth — se carga aparte una vez que hay sesión. Sin esto, la
  // app no puede distinguir un beneficiario de un profesional ICBF.
  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('No se pudo cargar el perfil del usuario:', error);
        setProfile(data || null);
      });
  }, [session]);

  useEffect(() => {
    if (!import.meta.env.DEV || session !== null || !DEV_EMAIL || !DEV_PASSWORD || autoLoginIntentado.current) return;
    autoLoginIntentado.current = true;
    supabase.auth.signInWithPassword({ email: DEV_EMAIL, password: DEV_PASSWORD })
      .then(({ error }) => {
        if (error) console.error('Auto-login de desarrollo falló:', error.message);
      });
  }, [session]);

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  // Registro de beneficiario: la metadata `tipo_cuenta` es lo único que
  // evita que el trigger handle_new_user() le cree una fila en `profiles`
  // (ver 0004_beneficiario_autenticado.sql) — sin ella quedaría
  // indistinguible de una cuenta de staff. `data.session` puede venir
  // null si el proyecto de Supabase exige confirmar el correo antes de
  // otorgar sesión; quien llame a esto debe manejar ese caso.
  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { tipo_cuenta: 'beneficiario' } },
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ session, profile, cargando: session === undefined, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
