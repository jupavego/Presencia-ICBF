import { useEffect, useState } from 'react';
import TopBar from './components/layout/TopBar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Hero from './components/layout/Hero.jsx';
import Home from './components/home/Home.jsx';
import StagePanel from './components/StagePanel.jsx';
import AmbitosPanel from './components/AmbitosPanel.jsx';
import PerfilSesionPanel from './components/PerfilSesionPanel.jsx';
import FormatViewer from './components/FormatViewer.jsx';
import LoginScreen from './components/auth/LoginScreen.jsx';
import { ETAPAS } from './data/etapas.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CasoProvider } from './context/CasoContext.jsx';
import { PerfilSesionProvider } from './context/PerfilSesionContext.jsx';
import { FamiliaProvider } from './context/FamiliaContext.jsx';
import { CompromisosProvider } from './context/CompromisosContext.jsx';

function AppShell() {
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = Inicio, 'herramientas' = módulo de perfilamiento, 'perfil' = perfil de sesión, número = índice en ETAPAS
  const [openFormat, setOpenFormat] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') { setOpenFormat(null); setMostrarLogin(false); }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const etapa = typeof activeIndex === 'number' && activeIndex >= 0 ? ETAPAS[activeIndex] : null;
  const herramientas = activeIndex === 'herramientas';
  const perfilSesion = activeIndex === 'perfil';

  return (
    <>
      <TopBar onRequestLogin={() => setMostrarLogin(true)} />
      <div className="shell">
        <Sidebar etapas={ETAPAS} activeIndex={activeIndex} onSelect={setActiveIndex} />
        <main className="content">
          {etapa ? (
            <>
              <Hero />
              <StagePanel etapa={etapa} onOpenFormat={setOpenFormat} />
            </>
          ) : herramientas ? (
            <AmbitosPanel onOpenFormat={setOpenFormat} />
          ) : perfilSesion ? (
            <PerfilSesionPanel onOpenFormat={setOpenFormat} />
          ) : (
            <Home onSelectStage={setActiveIndex} />
          )}
        </main>
      </div>
      <FormatViewer formato={openFormat} onClose={() => setOpenFormat(null)} />
      {mostrarLogin && !session && <LoginScreen onClose={() => setMostrarLogin(false)} />}
    </>
  );
}

// Sin sesión de Supabase, el sitio sigue siendo utilizable en "modo
// invitado": cualquier persona puede diligenciar cualquier formato o
// herramienta y ver su lectura/orientación calculada en el navegador,
// pero nada queda guardado en el servidor — toda la capa de persistencia
// (CasoContext, PerfilSesionContext, FamiliaContext, CompromisosContext,
// persistenciaCaso.js) ya está diseñada para degradar sin errores cuando
// no hay `casoActivoId` (que nunca lo hay sin sesión, porque las
// políticas RLS de Supabase rechazan la escritura anónima) — no fue
// necesario tocar esa capa. Solo se retiró el bloqueo duro que existía
// aquí antes (mostrar solo LoginScreen sin sesión); iniciar sesión ahora
// es una acción opcional disponible desde la barra superior en cualquier
// momento, para desbloquear el guardado.
function AuthGate() {
  const { cargando } = useAuth();
  if (cargando) return null;
  return (
    <CasoProvider>
      <FamiliaProvider>
        <CompromisosProvider>
          <PerfilSesionProvider>
            <AppShell />
          </PerfilSesionProvider>
        </CompromisosProvider>
      </FamiliaProvider>
    </CasoProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
