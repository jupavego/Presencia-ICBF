import FlowMap from './FlowMap.jsx';
import Callout from '../ui/Callout.jsx';
import { ETAPAS } from '../../data/etapas.js';
import {
  PROPOSITO, OBJETIVOS_ESPECIFICOS, POBLACION, CRITERIOS_PRIORIZACION,
  COMPONENTES_SERVICIO, FORMAS_ACOMPANAMIENTO, RESULTADOS_ESPERADOS,
} from '../../data/servicioInfo.js';

export default function Home({ onSelectStage }) {
  return (
    <div className="home">
      <section className="home-hero">
        <span className="home-kicker">Servicio Presencia · ICBF</span>
        <h1>Acompañar para que cada familia gestione sus propios recursos</h1>
        <p>{PROPOSITO.parrafo1}</p>
        <p>{PROPOSITO.parrafo2}</p>
        <div className="home-objetivo">
          <b>Objetivo general</b>
          <p>{PROPOSITO.objetivoGeneral}</p>
        </div>
      </section>

      <section className="home-section">
        <h2>¿Cómo se traduce ese objetivo?</h2>
        <div className="home-grid-3">
          {OBJETIVOS_ESPECIFICOS.map((o, i) => (
            <div className="home-card" key={i}>
              <span className="home-card-num">{i + 1}</span>
              <p>{o}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>¿A quién acompaña?</h2>
        <p>{POBLACION.descripcion}</p>
        <div className="func-row">
          {POBLACION.eventos.map((e) => <span className="func-chip" key={e}>{e}</span>)}
        </div>
        <Callout>{POBLACION.enfasis}</Callout>
        <div className="home-grid-2" style={{ marginTop: 14 }}>
          {CRITERIOS_PRIORIZACION.map((c) => (
            <div className="home-card" key={c.titulo}><b>{c.titulo}</b><p>{c.desc}</p></div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>¿Cómo se ejecuta?</h2>
        <p className="home-subtle">Tres componentes orientan todo el acompañamiento:</p>
        <div className="home-grid-3">
          {COMPONENTES_SERVICIO.map((c) => (
            <div className="home-card accent" key={c.titulo}><b>{c.titulo}</b><p>{c.desc}</p></div>
          ))}
        </div>
        <p className="home-subtle" style={{ marginTop: 18 }}>Y se materializa en tres formas de acompañamiento:</p>
        <div className="home-grid-3">
          {FORMAS_ACOMPANAMIENTO.map((f) => (
            <div className="home-card" key={f.titulo}><b>{f.titulo}</b><p>{f.desc}</p></div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>¿Qué resultados se esperan?</h2>
        <ul className="home-results">
          {RESULTADOS_ESPERADOS.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </section>

      <section className="home-section">
        <h2>Flujo operativo del servicio</h2>
        <p className="home-subtle">Recorre las etapas de la prestación del servicio: pasa el cursor —o navega con teclado— por cada una para ver de qué se trata, y haz clic para abrir sus formatos.</p>
        <FlowMap etapas={ETAPAS} onSelect={onSelectStage} />
      </section>
    </div>
  );
}
