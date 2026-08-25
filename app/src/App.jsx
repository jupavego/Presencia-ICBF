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
import RetomarCasoScreen from './components/auth/RetomarCasoScreen.jsx';
import BolsaCasosPanel from './components/caso/BolsaCasosPanel.jsx';
import { ETAPAS } from './data/etapas.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CasoProvider } from './context/CasoContext.jsx';
import { PerfilSesionProvider } from './context/PerfilSesionContext.jsx';
import { FamiliaProvider } from './context/FamiliaContext.jsx';
import { CompromisosProvider } from './context/CompromisosContext.jsx';

function AppShell() {
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = Inicio, 'herramientas' = módulo de perfilamiento, 'perfil' = perfil de sesión, 'bolsa' = bolsa de casos, número = índice en ETAPAS
  const [openFormat, setOpenFormat] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRetomar, setMostrarRetomar] = useState(false);
  const { session, profile } = useAuth();
  const puedeGestionarCasos = profile?.rol === 'profesional_icbf' || profile?.rol === 'admin';

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') { setOpenFormat(null); setMostrarLogin(false); setMostrarRetomar(false); }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const etapa = typeof activeIndex === 'number' && activeIndex >= 0 ? ETAPAS[activeIndex] : null;
  const herramientas = activeIndex === 'herramientas';
  const perfilSesion = activeIndex === 'perfil';
  const bolsaCasos = activeIndex === 'bolsa';

  return (
    <>
      <TopBar onRequestLogin={() => setMostrarLogin(true)} onRequestRetomar={() => setMostrarRetomar(true)} />
      <div className="shell">
        <Sidebar etapas={ETAPAS} activeIndex={activeIndex} onSelect={setActiveIndex} puedeGestionarCasos={puedeGestionarCasos} />
        <main className="content">
          {etapa ? (
            <>
              {/* Solo en Acceso y Admisión (etapa 01): el resto de etapas ya
                  quedan orientadas por su propio encabezado en StagePanel,
                  no hace falta repetir la presentación general del servicio. */}
              {etapa.code === '01' && <Hero />}
              <StagePanel etapa={etapa} onOpenFormat={setOpenFormat} />
            </>
          ) : herramientas ? (
            <AmbitosPanel onOpenFormat={setOpenFormat} />
          ) : perfilSesion ? (
            <PerfilSesionPanel onOpenFormat={setOpenFormat} />
          ) : bolsaCasos ? (
            <BolsaCasosPanel />
          ) : (
            <Home onSelectStage={setActiveIndex} />
          )}
        </main>
      </div>
      <FormatViewer formato={openFormat} onClose={() => setOpenFormat(null)} />
      {mostrarLogin && !session && <LoginScreen onClose={() => setMostrarLogin(false)} />}
      {mostrarRetomar && <RetomarCasoScreen onClose={() => setMostrarRetomar(false)} />}
    </>
  );
}

// Con o sin sesión de Supabase, el sitio es utilizable: cualquier persona
// puede diligenciar PET, las 25 herramientas del Módulo de Perfilamiento y
// F1 (Mapa de Pertenencia) sin cuenta — ese es el rol "beneficiario" — y
// esos diligenciamientos SÍ quedan guardados, a través de funciones
// `security definer` que validan un código de acceso en vez de depender
// de una sesión (ver crear_caso_beneficiario / guardar_formato_beneficiario
// / guardar_perfilamiento_beneficiario en 0003_roles_bolsa_asignacion.sql,
// y CasoContext.jsx/persistenciaBeneficiario.js). El resto de formatos
// oficiales (F3, F5-F10) y la Bolsa de casos siguen requiriendo sesión de
// staff — la capa de persistencia se bifurca internamente según haya
// sesión o no, no hace falta que este componente lo sepa.
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
