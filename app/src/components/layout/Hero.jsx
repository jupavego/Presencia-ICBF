import { ETAPAS } from '../../data/etapas.js';

const PRINCIPIOS = [
  'Enfoque diferencial e intercultural',
  'Participación y corresponsabilidad',
  'Respeto, dignidad y no discriminación',
  'Confidencialidad de la información',
  'Flexibilidad y pertinencia territorial',
  'Enfoque de derechos y curso de vida',
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-top">
        <div>
          <h1>Presencia para la Convivencia y el Fortalecimiento de Vínculos Familiares y Comunitarios</h1>
          <p>Acompañamos a las familias y comunidades para fortalecer sus capacidades, relaciones y redes de apoyo, promoviendo entornos de cuidado, bienestar y buen vivir. Este panel organiza el proceso de prestación del servicio en {ETAPAS.length} etapas y presenta, para cada una, los formatos institucionales ya digitalizados.</p>
        </div>
        <div className="hero-badge">
          GO3.MT5.PP · Versión 2<br />
          <span style={{ fontWeight: 400, color: 'var(--muted)' }}>Guía Operativa 2026</span>
        </div>
      </div>
      <details className="about">
        <summary>Principios del servicio (ver)</summary>
        <div className="principles">
          {PRINCIPIOS.map((p) => (
            <div key={p}><span className="dot" />{p}</div>
          ))}
        </div>
      </details>
    </section>
  );
}
