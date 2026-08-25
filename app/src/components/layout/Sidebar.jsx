import { countDisponibles } from '../../data/etapas.js';
import { AMBITOS } from '../../data/ambitos.js';

export default function Sidebar({ etapas, activeIndex, onSelect, puedeGestionarCasos, esInvitado }) {
  return (
    <aside className="stages">
      <button type="button" className={`stage-btn${activeIndex === -1 ? ' active' : ''}`} onClick={() => onSelect(-1)}>
        <span className="num">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.5 10v9h13v-9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="lbl">Inicio</span>
      </button>
      <div className="side-divider" />
      {etapas.map((e, i) => (
        <button key={e.code} type="button" className={`stage-btn${i === activeIndex ? ' active' : ''}`} onClick={() => onSelect(i)}>
          <span className="num">{e.code}</span>
          <span className="lbl">{e.nombre}</span>
          <span className="count">{countDisponibles(e)}</span>
        </button>
      ))}
      {puedeGestionarCasos && (
        <>
          <div className="side-divider" />
          <button type="button" className={`stage-btn${activeIndex === 'bolsa' ? ' active' : ''}`} onClick={() => onSelect('bolsa')}>
            <span className="num">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.3">
                <path d="M3 12h4.5l1.5 3h6l1.5-3H21" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.5 6h13L21 12v6a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-6L5.5 6Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="lbl">Bolsa de casos</span>
          </button>
        </>
      )}
      <div className="side-divider" />
      <button type="button" className={`stage-btn${activeIndex === 'herramientas' ? ' active' : ''}`} onClick={() => onSelect('herramientas')}>
        <span className="num">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="lbl">Herramientas</span>
        <span className="count">{AMBITOS.length}</span>
      </button>
      {esInvitado && (
        <div style={{ marginTop: 'auto', paddingTop: 14 }}>
          <span
            className="topbar-tag"
            title="La petición inicial, el Mapa de Pertenencia y las herramientas del Módulo de Perfilamiento quedan guardadas con un código de acceso. El resto de formatos oficiales lo diligencia el equipo de acompañamiento."
          >
            Modo invitado
          </span>
        </div>
      )}
    </aside>
  );
}
