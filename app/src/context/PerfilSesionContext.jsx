import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useCaso } from './CasoContext.jsx';
import { useAuth } from './AuthContext.jsx';
import { guardarPerfilamientoBeneficiario, obtenerPerfilamientoBeneficiario } from '../lib/persistenciaBeneficiario.js';

// Perfil de sesión: registro compartido de los resultados que cada
// herramienta del módulo de Perfilamiento produce para el caso activo.
// Antes de esto, cada una de las 25 herramientas leía sus propias
// respuestas de forma aislada (useState local en cada componente) y todo
// se perdía al cerrar el formulario — no había forma de que, por ejemplo,
// Proyecto de Vida "supiera" lo que ya se había explorado en
// Empoderamiento familiar, ni siquiera dentro de la misma visita.
//
// Ahora `registro` vive en memoria para lecturas rápidas mientras se
// navega entre herramientas, pero cada resultado completo también se
// guarda en la tabla `perfilamiento_resultados` de Supabase (caso_id +
// instrumento_id) — así sí sobrevive a recargar la página o a volver en
// otra visita, siempre que se seleccione el mismo caso. Es la primera
// pieza real del Producto 8 (integración entre esferas) y de la
// comparación T0/T1/T2 en el tiempo.
//
// Solo guarda resultados de herramientas ya completas (`resultado.completo
// === true`) — un formulario a medio llenar no aporta nada al perfil de
// sesión, y publicar solo lo completo evita mostrar patrones parciales o
// engañosos en el panel de síntesis (`PerfilSesionPanel.jsx`).
const PerfilSesionContext = createContext(null);

export function PerfilSesionProvider({ children }) {
  const { casoActivoId, codigoAcceso } = useCaso();
  const { session } = useAuth();
  const [registro, setRegistro] = useState({});
  const [cargando, setCargando] = useState(false);

  // Al cambiar de caso activo, hidrata el registro con lo que ya exista
  // guardado para ese caso — sin esto, cada recarga de página (o cada
  // cambio de caso) volvería a empezar en blanco pese a tener datos
  // guardados en Supabase. Sin sesión (beneficiario), la RLS no permite un
  // select directo — se hidrata vía obtener_perfilamiento_por_codigo.
  // `.order('actualizado_en')` porque desde 0003_roles_bolsa_asignacion.sql
  // puede haber varias filas por instrumento (historial, ya no se
  // sobrescribe) — la última del recorrido gana, que es la más reciente.
  useEffect(() => {
    if (!casoActivoId) {
      setRegistro({});
      return;
    }
    setCargando(true);
    const cargar = session
      ? supabase
          .from('perfilamiento_resultados')
          .select('instrumento_id, resultado')
          .eq('caso_id', casoActivoId)
          .order('actualizado_en', { ascending: true })
          .then(({ data, error }) => {
            if (error) console.error('No se pudo cargar el perfil de sesión guardado:', error);
            return data || [];
          })
      : obtenerPerfilamientoBeneficiario(codigoAcceso);

    cargar
      .then((filas) => {
        const hidratado = {};
        for (const fila of filas) hidratado[fila.instrumento_id] = fila.resultado;
        setRegistro(hidratado);
      })
      .finally(() => setCargando(false));
  }, [casoActivoId, codigoAcceso, session]);

  const registrar = useCallback((instrumentoId, resultado) => {
    setRegistro((r) => (r[instrumentoId] === resultado ? r : { ...r, [instrumentoId]: resultado }));
    if (!casoActivoId) return; // sin caso activo, el resultado queda solo en memoria para esta visita
    if (session) {
      supabase
        .from('perfilamiento_resultados')
        .insert({ caso_id: casoActivoId, instrumento_id: instrumentoId, resultado })
        .then(({ error }) => {
          if (error) console.error(`No se pudo guardar el resultado de ${instrumentoId} en el servidor:`, error);
        });
      return;
    }
    guardarPerfilamientoBeneficiario(codigoAcceso, instrumentoId, resultado);
  }, [casoActivoId, codigoAcceso, session]);

  const value = useMemo(() => ({ registro, registrar, cargando }), [registro, registrar, cargando]);

  return <PerfilSesionContext.Provider value={value}>{children}</PerfilSesionContext.Provider>;
}

export function usePerfilSesion() {
  const ctx = useContext(PerfilSesionContext);
  if (!ctx) throw new Error('usePerfilSesion debe usarse dentro de PerfilSesionProvider');
  return ctx;
}

// Hook de conveniencia: cada herramienta lo llama con su propio id (el
// mismo `componentKey` de registry.js) y su `resultado` ya calculado —
// no hace nada mientras el formulario esté incompleto.
export function useRegistrarEnPerfilSesion(instrumentoId, resultado) {
  const { registrar } = usePerfilSesion();
  useEffect(() => {
    if (resultado?.completo) registrar(instrumentoId, resultado);
  }, [instrumentoId, resultado, registrar]);
}
