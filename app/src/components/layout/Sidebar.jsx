import { countDisponibles } from '../../data/etapas.js';
import { AMBITOS } from '../../data/ambitos.js';

export default function Sidebar({ etapas, activeIndex, onSelect }) {
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
      <div className="side-divider" />
      <button type="button" className={`stage-btn${activeIndex === 'herramientas' ? ' active' : ''}`} onClick={() => onSelect('herramientas')}>
        <span className="num">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path d="M14.5 3.5 20.5 9.5 9.5 20.5 3.5 14.5Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 12 12 18" strokeLinecap="round" />
          </svg>
        </span>
        <span className="lbl">Herramientas</span>
        <span className="count">{AMBITOS.length}</span>
      </button>
      <button type="button" className={`stage-btn${activeIndex === 'perfil' ? ' active' : ''}`} onClick={() => onSelect('perfil')}>
        <span className="num">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.3">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c1.2-4 4-6 7-6s5.8 2 7 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="lbl">Perfil de sesión</span>
      </button>
    </aside>
  );
}
