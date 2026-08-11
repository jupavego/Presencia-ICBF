import { countDisponibles } from '../../data/etapas.js';

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
      <div className="side-foot">Estructura basada en la Guía Operativa GO3.MT5.PP v2 y en la arquitectura operativa ajustada del servicio Presencia.</div>
    </aside>
  );
}
