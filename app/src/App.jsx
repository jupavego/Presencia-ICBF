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

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpenFormat(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const etapa = typeof activeIndex === 'number' && activeIndex >= 0 ? ETAPAS[activeIndex] : null;
  const herramientas = activeIndex === 'herramientas';
  const perfilSesion = activeIndex === 'perfil';

  return (
    <>
      <TopBar />
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
    </>
  );
}

// Puerta de acceso: sin sesión de Supabase, no se monta nada del resto de
// la app (ni el shell ni ningún dato) — solo LoginScreen. Ver
// AuthContext.jsx.
function AuthGate() {
  const { session, cargando } = useAuth();
  if (cargando) return null;
  if (!session) return <LoginScreen />;
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
