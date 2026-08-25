import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from './AuthContext.jsx';

// Caso activo: la entidad raíz que hoy no existe en ningún lugar del
// cliente — cada formato/herramienta vivía aislado. `casoActivoId` solo
// se guarda en localStorage para recordar cuál caso quedó abierto en este
// navegador; los datos reales (resultados de las herramientas, datos de
// los formatos oficiales) viven en Supabase, colgados de ese id. Ver
// PerfilSesionContext.jsx, que lee `casoActivoId` para hidratar/persistir
// los resultados del Módulo de Perfilamiento.
//
// Creación y lectura pasan siempre por funciones `security definer`
// (crear_caso_beneficiario / obtener_caso_por_codigo, ver
// 0003_roles_bolsa_asignacion.sql) — funcionan igual con o sin sesión, así
// que no hace falta bifurcar la lógica de creación entre invitado y staff.
// Sin sesión, además del id se guarda el `codigo_acceso`: es el único
// mecanismo para que un beneficiario retome su caso desde otro
// dispositivo, ya que la RLS de `casos` no le permite un `select` directo.
const CasoContext = createContext(null);
const STORAGE_KEY = 'presencia_caso_activo_id';
const CODIGO_KEY = 'presencia_codigo_acceso';

export function CasoProvider({ children }) {
  const { session } = useAuth();
  const [casoActivoId, setCasoActivoId] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [codigoAcceso, setCodigoAcceso] = useState(() => localStorage.getItem(CODIGO_KEY));
  const [caso, setCaso] = useState(null);

  useEffect(() => {
    if (!casoActivoId) {
      setCaso(null);
      return;
    }
    if (session) {
      supabase
        .from('casos')
        .select('*')
        .eq('id', casoActivoId)
        .maybeSingle()
        .then(({ data }) => setCaso(data || null));
      return;
    }
    if (!codigoAcceso) {
      setCaso(null);
      return;
    }
    supabase
      .rpc('obtener_caso_por_codigo', { p_codigo: codigoAcceso })
      .then(({ data }) => setCaso(data || null));
  }, [casoActivoId, codigoAcceso, session]);

  const seleccionarCaso = useCallback((id) => {
    localStorage.setItem(STORAGE_KEY, id);
    setCasoActivoId(id);
  }, []);

  const crearCaso = useCallback(async ({ numeroPeticion, nombreParticipante, municipio }) => {
    const { data, error } = await supabase.rpc('crear_caso_beneficiario', {
      p_nombre: nombreParticipante || null,
      p_municipio: municipio || null,
      p_numero_peticion: numeroPeticion || null,
    });
    if (error) throw error;
    localStorage.setItem(STORAGE_KEY, data.id);
    localStorage.setItem(CODIGO_KEY, data.codigo_acceso);
    setCasoActivoId(data.id);
    setCodigoAcceso(data.codigo_acceso);
    setCaso(data);
    return data;
  }, []);

  // Beneficiario cambiando de dispositivo, o retomando tras borrar datos
  // del navegador — ver RetomarCasoScreen.jsx.
  const retomarConCodigo = useCallback(async (codigo) => {
    const { data, error } = await supabase.rpc('obtener_caso_por_codigo', { p_codigo: codigo });
    if (error) throw error;
    if (!data) return null;
    localStorage.setItem(STORAGE_KEY, data.id);
    localStorage.setItem(CODIGO_KEY, data.codigo_acceso);
    setCasoActivoId(data.id);
    setCodigoAcceso(data.codigo_acceso);
    setCaso(data);
    return data;
  }, []);

  const cerrarCaso = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CODIGO_KEY);
    setCasoActivoId(null);
    setCodigoAcceso(null);
    setCaso(null);
  }, []);

  return (
    <CasoContext.Provider
      value={{ casoActivoId, codigoAcceso, caso, seleccionarCaso, crearCaso, retomarConCodigo, cerrarCaso }}
    >
      {children}
    </CasoContext.Provider>
  );
}

export function useCaso() {
  const ctx = useContext(CasoContext);
  if (!ctx) throw new Error('useCaso debe usarse dentro de CasoProvider');
  return ctx;
}
