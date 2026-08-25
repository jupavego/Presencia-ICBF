import CasoBar from '../caso/CasoBar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCaso } from '../../context/CasoContext.jsx';

export default function TopBar({ onRequestLogin, onOpenPerfilSesion }) {
  const { session, signOut } = useAuth();
  const { casoActivoId } = useCaso();
  // Sin sesión, campana (estado del caso) y perfil de sesión solo tienen
  // algo que mostrar una vez el invitado ya diligenció y guardó su
  // Petición de Vinculación (PET) — ese submit es lo que crea el caso y
  // pone casoActivoId (ver PeticionAcceso.jsx). Antes de eso no hay caso
  // al que esos íconos puedan referirse.
  const mostrarCasoYPerfil = session || casoActivoId;
  return (
    <header className="topbar">
      <img className="mark" src="/favicon.svg" alt="Presencia" />
      <div className="brandblock">
        <span className="icbf">ICBF - Regional Antioquia</span>
        <span className="servicio">Servicio <b>PRESENCIA</b> — Portal de Gestión y Acompañamiento</span>
      </div>
      <div className="topbar-spacer" />
      {mostrarCasoYPerfil && (
        <>
          <button type="button" className="icon-btn" onClick={onOpenPerfilSesion} title="Perfil de sesión" aria-label="Perfil de sesión">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c1.2-4 4-6 7-6s5.8 2 7 6" />
            </svg>
          </button>
          <CasoBar />
        </>
      )}
      {session ? (
        <button type="button" className="icon-btn" onClick={signOut} title="Cerrar sesión" aria-label="Cerrar sesión">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      ) : (
        <button type="button" className="icon-btn" onClick={onRequestLogin} title="Iniciar sesión" aria-label="Iniciar sesión">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </button>
      )}
      <span className="topbar-tag">Prototipo interno · v0.2</span>
    </header>
  );
}
