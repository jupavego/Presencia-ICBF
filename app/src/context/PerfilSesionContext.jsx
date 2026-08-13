import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Perfil de sesión: registro compartido en memoria de los resultados que
// cada herramienta del módulo de Perfilamiento produce. Vive mientras la
// pestaña esté abierta — se pierde al recargar, igual que las respuestas
// de cada formulario individual hoy — pero ya no se pierde al cerrar una
// herramienta y abrir otra dentro de la misma visita.
//
// Antes de esto, cada una de las 24 herramientas leía sus propias
// respuestas de forma aislada (useState local en cada componente) y todo
// se perdía al cerrar el formulario — no había forma de que, por ejemplo,
// Proyecto de Vida "supiera" lo que ya se había explorado en
// Empoderamiento familiar dentro de la misma visita. Este contexto es la
// primera pieza del Producto 8 (integración entre esferas) que no
// requiere backend: habilita que las herramientas se lean entre sí y le
// da al futuro motor de recomendaciones (Producto 9) un lugar único de
// donde partir, en vez de que cada herramienta viva en su propia burbuja.
//
// Solo guarda resultados de herramientas ya completas (`resultado.completo
// === true`) — un formulario a medio llenar no aporta nada al perfil de
// sesión, y publicar solo lo completo evita mostrar patrones parciales o
// engañosos en el panel de síntesis (`PerfilSesionPanel.jsx`).
const PerfilSesionContext = createContext(null);

export function PerfilSesionProvider({ children }) {
  const [registro, setRegistro] = useState({});

  const registrar = useCallback((instrumentoId, resultado) => {
    setRegistro((r) => (r[instrumentoId] === resultado ? r : { ...r, [instrumentoId]: resultado }));
  }, []);

  const value = useMemo(() => ({ registro, registrar }), [registro, registrar]);

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
