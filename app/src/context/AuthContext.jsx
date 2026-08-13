import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

// Sesión de autenticación de Supabase. No hay registro público en esta
// primera vuelta — las cuentas de los profesionales se crean manualmente
// desde el dashboard de Supabase (Authentication → Users), para no dejar
// la API abierta a que cualquiera se cree una cuenta sobre datos
// sensibles de familias del ICBF. Ver README.md "Configuración de
// Supabase".
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
  const autoLoginIntentado = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      setSession(nuevaSesion);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

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

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ session, cargando: session === undefined, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
