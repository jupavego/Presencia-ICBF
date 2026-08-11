import FormatCard from './FormatCard.jsx';
import Callout from './ui/Callout.jsx';
import { countDisponibles } from '../data/etapas.js';

export default function StagePanel({ etapa, onOpenFormat }) {
  const rawTotal = etapa.formatos.length;
  const disponibles = countDisponibles(etapa);
  return (
    <section className="stage-panel">
      <div className="stage-head">
        <div className="eyebrow">Etapa {etapa.code} · {disponibles} formato{disponibles === 1 ? '' : 's'} disponible{disponibles === 1 ? '' : 's'}</div>
        <h2>{etapa.nombre}</h2>
        <p>{etapa.proposito}</p>
        <div className="func-row">
          {etapa.funciones.map((f) => <span className="func-chip" key={f}>{f}</span>)}
        </div>
      </div>
      <div className="formats">
        <h3>Formatos e instrumentos digitalizados</h3>
        {rawTotal > 0 ? (
          <div className="format-grid">
            {etapa.formatos.map((f) => <FormatCard key={f.codigo + f.nombre} formato={f} onOpen={onOpenFormat} />)}
          </div>
        ) : (
          <Callout>{etapa.notaFormatos}</Callout>
        )}
      </div>
    </section>
  );
}
