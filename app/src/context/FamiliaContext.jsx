import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useCaso } from './CasoContext.jsx';

// Integrantes de la familia del caso activo: antes vivían solo dentro del
// JSON de F7PerfilSocioFamiliar.jsx (formatos_oficiales_datos, 'F7'), sin
// que ningún otro formato pudiera leerlos ni referenciarse a la misma
// persona. Ahora son su propia fila en `familia_integrantes` (un arreglo
// JSONB por caso, mismo patrón que ya usa guardarDatosFormatoOficial) —
// cualquier formato o herramienta puede leer `integrantes` del caso activo
// sin volver a pedirlos.
const FamiliaContext = createContext(null);

export function FamiliaProvider({ children }) {
  const { casoActivoId } = useCaso();
  const [integrantes, setIntegrantes] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!casoActivoId) {
      setIntegrantes([]);
      return;
    }
    setCargando(true);
    supabase
      .from('familia_integrantes')
      .select('integrantes')
      .eq('caso_id', casoActivoId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('No se pudieron cargar los integrantes de la familia:', error);
          setIntegrantes([]);
          return;
        }
        setIntegrantes(data?.integrantes || []);
      })
      .finally(() => setCargando(false));
  }, [casoActivoId]);

  const guardarIntegrantes = useCallback((nuevaLista) => {
    setIntegrantes(nuevaLista);
    if (!casoActivoId) return; // sin caso activo, queda solo en memoria para esta visita
    supabase
      .from('familia_integrantes')
      .upsert(
        { caso_id: casoActivoId, integrantes: nuevaLista, actualizado_en: new Date().toISOString() },
        { onConflict: 'caso_id' },
      )
      .then(({ error }) => {
        if (error) console.error('No se pudieron guardar los integrantes de la familia:', error);
      });
  }, [casoActivoId]);

  const value = { integrantes, guardarIntegrantes, cargando };

  return <FamiliaContext.Provider value={value}>{children}</FamiliaContext.Provider>;
}

export function useFamilia() {
  const ctx = useContext(FamiliaContext);
  if (!ctx) throw new Error('useFamilia debe usarse dentro de FamiliaProvider');
  return ctx;
}
