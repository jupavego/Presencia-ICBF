import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

// Caso activo: la entidad raíz que hoy no existe en ningún lugar del
// cliente — cada formato/herramienta vivía aislado. `casoActivoId` solo
// se guarda en localStorage para recordar cuál caso quedó abierto en este
// navegador; los datos reales (resultados de las herramientas, datos de
// los formatos oficiales) viven en Supabase, colgados de ese id. Ver
// PerfilSesionContext.jsx, que lee `casoActivoId` para hidratar/persistir
// los resultados del Módulo de Perfilamiento.
const CasoContext = createContext(null);
const STORAGE_KEY = 'presencia_caso_activo_id';

export function CasoProvider({ children }) {
  const [casoActivoId, setCasoActivoId] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [caso, setCaso] = useState(null);

  useEffect(() => {
    if (!casoActivoId) {
      setCaso(null);
      return;
    }
    supabase
      .from('casos')
      .select('*')
      .eq('id', casoActivoId)
      .maybeSingle()
      .then(({ data }) => setCaso(data || null));
  }, [casoActivoId]);

  const seleccionarCaso = useCallback((id) => {
    localStorage.setItem(STORAGE_KEY, id);
    setCasoActivoId(id);
  }, []);

  const crearCaso = useCallback(async ({ numeroPeticion, nombreParticipante, municipio }) => {
    const { data: sesion } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('casos')
      .insert({
        numero_peticion: numeroPeticion || null,
        nombre_participante: nombreParticipante || null,
        municipio: municipio || null,
        creado_por: sesion?.user?.id,
      })
      .select()
      .single();
    if (error) throw error;
    localStorage.setItem(STORAGE_KEY, data.id);
    setCasoActivoId(data.id);
    setCaso(data);
    return data;
  }, []);

  const cerrarCaso = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCasoActivoId(null);
    setCaso(null);
  }, []);

  return (
    <CasoContext.Provider value={{ casoActivoId, caso, seleccionarCaso, crearCaso, cerrarCaso }}>
      {children}
    </CasoContext.Provider>
  );
}

export function useCaso() {
  const ctx = useContext(CasoContext);
  if (!ctx) throw new Error('useCaso debe usarse dentro de CasoProvider');
  return ctx;
}
