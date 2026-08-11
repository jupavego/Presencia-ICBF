import { FORMAT_REGISTRY } from './formats/registry.js';
import { findEtapaByComponentKey } from '../data/etapas.js';

export default function FormatViewer({ formato, onClose }) {
  if (!formato) return null;
  const Component = FORMAT_REGISTRY[formato.componentKey];
  const etapa = findEtapaByComponentKey(formato.componentKey);

  return (
    <div className="viewer" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="viewer-box">
        <div className="viewer-bar">
          <span className="vcode">{formato.codigo}</span>
          <span className="vtitle">{formato.nombre}</span>
          <button type="button" onClick={onClose}>Cerrar ✕</button>
        </div>
        <div className="viewer-body">
          <div className="fmain">
            {Component ? <Component etapaCode={etapa?.code} etapaNombre={etapa?.nombre} /> : <p>Este formato aún no está digitalizado.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
