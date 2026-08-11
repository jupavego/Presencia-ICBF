import { useState } from 'react';
import { countDisponibles } from '../../data/etapas.js';

// Mapa interactivo del flujo operativo: pasar el cursor (o navegar con
// teclado) por cada etapa actualiza el panel de detalle; hacer clic navega
// directamente a esa etapa dentro de la aplicación.
export default function FlowMap({ etapas, onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const etapa = etapas[activeIndex];
  const disponibles = countDisponibles(etapa);
  const codigosOficiales = etapa.formatos.filter((f) => f.codigoOficial);

  return (
    <div className="flowmap">
      <div className="flow-row">
        {etapas.map((e, i) => (
          <div className="flow-node-wrap" key={e.code}>
            <button
              type="button"
              className={`flow-node${i === activeIndex ? ' active' : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
              onFocus={() => setActiveIndex(i)}
              onClick={() => onSelect(i)}
            >
              <span className="flow-num">{e.code}</span>
              <span className="flow-label">{e.nombre}</span>
            </button>
            {i < etapas.length - 1 && <span className="flow-arrow">→</span>}
          </div>
        ))}
      </div>

      <div className="flow-detail">
        <div className="flow-detail-eyebrow">Etapa {etapa.code} · {disponibles} formato{disponibles === 1 ? '' : 's'} disponible{disponibles === 1 ? '' : 's'}</div>
        <h3>{etapa.nombre}</h3>
        <p>{etapa.proposito}</p>
        <div className="func-row">
          {etapa.funciones.map((f) => <span className="func-chip" key={f}>{f}</span>)}
        </div>
        {codigosOficiales.length > 0 && (
          <div className="flow-formats">
            <span className="flow-formats-label">Formato{codigosOficiales.length === 1 ? '' : 's'} oficial{codigosOficiales.length === 1 ? '' : 'es'}</span>
            {codigosOficiales.map((f) => (
              <span className="fcode" key={f.codigo + f.nombre} title={f.nombre}>{f.codigoOficial}</span>
            ))}
          </div>
        )}
        <button type="button" className="fbtn2 primary" style={{ marginTop: 14 }} onClick={() => onSelect(activeIndex)}>
          Ver formatos de esta etapa →
        </button>
      </div>
    </div>
  );
}
