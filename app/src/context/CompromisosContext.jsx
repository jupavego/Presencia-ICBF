import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useCaso } from './CasoContext.jsx';

// Compromisos y acuerdos del caso activo: antes vivían solo dentro del
// JSON de F6AcompanamientoEntornoFamiliar.jsx (formatos_oficiales_datos,
// 'F6'), sin forma de preguntar "¿qué compromisos están pendientes de
// este caso?" sin abrir ese formato puntual. Ahora son su propia fila en
// `compromisos` (un arreglo JSONB por caso, mismo patrón que ya usa
// guardarDatosFormatoOficial) — cualquier formato o vista puede leerlos o
// agregar los suyos (ver campo `origen` de cada ítem).
const CompromisosContext = createContext(null);

export function CompromisosProvider({ children }) {
  const { casoActivoId } = useCaso();
  const [compromisos, setCompromisos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!casoActivoId) {
      setCompromisos([]);
      return;
    }
    setCargando(true);
    supabase
      .from('compromisos')
      .select('items')
      .eq('caso_id', casoActivoId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('No se pudieron cargar los compromisos del caso:', error);
          setCompromisos([]);
          return;
        }
        setCompromisos(data?.items || []);
      })
      .finally(() => setCargando(false));
  }, [casoActivoId]);

  const guardarCompromisos = useCallback((nuevaLista) => {
    setCompromisos(nuevaLista);
    if (!casoActivoId) return; // sin caso activo, queda solo en memoria para esta visita
    supabase
      .from('compromisos')
      .upsert(
        { caso_id: casoActivoId, items: nuevaLista, actualizado_en: new Date().toISOString() },
        { onConflict: 'caso_id' },
      )
      .then(({ error }) => {
        if (error) console.error('No se pudieron guardar los compromisos del caso:', error);
      });
  }, [casoActivoId]);

  const value = { compromisos, guardarCompromisos, cargando };

  return <CompromisosContext.Provider value={value}>{children}</CompromisosContext.Provider>;
}

export function useCompromisos() {
  const ctx = useContext(CompromisosContext);
  if (!ctx) throw new Error('useCompromisos debe usarse dentro de CompromisosProvider');
  return ctx;
}
