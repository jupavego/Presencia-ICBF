import CasoBar from '../caso/CasoBar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function TopBar({ onRequestLogin }) {
  const { session, signOut } = useAuth();
  return (
    <header className="topbar">
      <svg className="mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="23" fill="#ffffff12" stroke="#bfe6b0" strokeWidth="1" />
        <path d="M24 30c-6-4.5-11-8-11-13.2C13 12.8 16 10 19.6 10c2 0 3.7 1 4.4 2.6C24.7 11 26.4 10 28.4 10 32 10 35 12.8 35 16.8 35 22 30 25.5 24 30Z" fill="#39a900" />
        <circle cx="24" cy="34.5" r="3.4" fill="#fff" />
      </svg>
      <div className="brandblock">
        <span className="icbf">ICBF · Bienestar Familiar</span>
        <span className="servicio">Servicio <b>PRESENCIA</b> — Panel de Etapas y Formatos</span>
      </div>
      <div className="topbar-spacer" />
      <CasoBar />
      {session ? (
        <button type="button" className="ftab" onClick={signOut} title={session.user?.email}>
          Cerrar sesión
        </button>
      ) : (
        <>
          <span className="topbar-tag" title="Puede diligenciar cualquier formato o herramienta, pero nada queda guardado">Modo invitado · sin guardado</span>
          <button type="button" className="ftab" onClick={onRequestLogin}>
            Iniciar sesión
          </button>
        </>
      )}
      <span className="topbar-tag">Prototipo interno · v0.2</span>
    </header>
  );
}
