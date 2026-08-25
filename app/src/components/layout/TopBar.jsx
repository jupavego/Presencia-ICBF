import CasoBar from '../caso/CasoBar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function TopBar({ onRequestLogin, onRequestRetomar, onOpenPerfilSesion }) {
  const { session, signOut } = useAuth();
  return (
    <header className="topbar">
      <svg className="mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="23" fill="#eaf7e6" stroke="#a9d99a" strokeWidth="1.2" />
        <path d="M24 30c-6-4.5-11-8-11-13.2C13 12.8 16 10 19.6 10c2 0 3.7 1 4.4 2.6C24.7 11 26.4 10 28.4 10 32 10 35 12.8 35 16.8 35 22 30 25.5 24 30Z" fill="#7ac142" />
        <circle cx="24" cy="34.5" r="3.4" fill="#fff" />
      </svg>
      <div className="brandblock">
        <span className="icbf">ICBF · Bienestar Familiar</span>
        <span className="servicio">Servicio <b>PRESENCIA</b> — Portal de Gestión y Acompañamiento</span>
      </div>
      <div className="topbar-spacer" />
      <CasoBar />
      <button type="button" className="icon-btn" onClick={onOpenPerfilSesion} title="Perfil de sesión" aria-label="Perfil de sesión">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.2-4 4-6 7-6s5.8 2 7 6" />
        </svg>
      </button>
      {session ? (
        <button type="button" className="icon-btn" onClick={signOut} title="Cerrar sesión" aria-label="Cerrar sesión">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      ) : (
        <>
          <span className="topbar-tag" title="La petición inicial, el Mapa de Pertenencia y las herramientas del Módulo de Perfilamiento quedan guardadas con un código de acceso. El resto de formatos oficiales lo diligencia el equipo de acompañamiento.">Modo invitado</span>
          <button type="button" className="ftab" onClick={onRequestRetomar}>
            Retomar con código
          </button>
          <button type="button" className="ftab" onClick={onRequestLogin}>
            Iniciar sesión
          </button>
        </>
      )}
      <span className="topbar-tag">Prototipo interno · v0.2</span>
    </header>
  );
}
