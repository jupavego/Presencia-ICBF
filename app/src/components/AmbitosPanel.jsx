import FormatCard from './FormatCard.jsx';
import Callout from './ui/Callout.jsx';
import EsferasDiagrama from './EsferasDiagrama.jsx';
import { AMBITOS, countDisponiblesAmbito } from '../data/ambitos.js';
import { OBJETIVOS_ESPECIFICOS } from '../data/servicioInfo.js';

const OBJETIVO_CORTO = [
  'Crisis familiar',
  'Cuidado mutuo',
  'Proyecto de vida y redes',
];

export default function AmbitosPanel({ onOpenFormat }) {
  return (
    <section className="stage-panel ambitos-panel">
      <div className="stage-head">
        <div className="eyebrow">Módulo de Perfilamiento · 13 ámbitos de vida</div>
        <h2>Herramientas por ámbito de vida</h2>
        <p>
          Caja de herramientas transversal a las 7 etapas, organizada por ámbito
          de vida en vez de por trámite. Cada ámbito indica a cuál de los tres
          objetivos del servicio aporta directamente, para que el equipo de
          acompañamiento elija la herramienta según lo que la familia necesite
          profundizar — no reemplaza los formatos oficiales F1-F10.
        </p>
        <Callout>
          Las 25 herramientas propias del módulo ya están digitalizadas y funcionales, más el Mapa de Pertenencia
          (F1), que ya existía y se reutiliza aquí sin duplicarse. Ver <code>docs/arquitectura-modulo-perfilamiento.md</code> y{' '}
          <code>docs/matriz-variables-indicadores.md</code> para el sustento de cada herramienta, y el{' '}
          <b>Perfil de sesión</b> en el menú lateral para ver los resultados consolidados de lo ya completado.
        </Callout>
      </div>

      <EsferasDiagrama />

      {AMBITOS.map((ambito) => {
        const disponibles = countDisponiblesAmbito(ambito);
        return (
          <div className="ambito-block" id={`esfera-${ambito.codigo}`} key={ambito.codigo}>
            <div className="ambito-block-head">
              <span className="num">{ambito.codigo}</span>
              <div className="ambito-block-title">
                <h3>{ambito.nombre}</h3>
                <p>{ambito.proposito}</p>
              </div>
              <div className="ambito-objetivos">
                {ambito.objetivos.map((i) => (
                  <span className="func-chip objetivo-chip" key={i} title={OBJETIVOS_ESPECIFICOS[i]}>
                    Objetivo {i + 1} · {OBJETIVO_CORTO[i]}
                  </span>
                ))}
              </div>
            </div>
            <div className="format-grid">
              {ambito.herramientas.map((h) => (
                <FormatCard key={ambito.codigo + h.codigo} formato={h} onOpen={onOpenFormat} />
              ))}
            </div>
            {disponibles === 0 && (
              <p className="ambito-nota-diseno">
                {ambito.herramientas.some((h) => h.disenoPropio)
                  ? 'Incluye categorías de exploración de diseño propio del equipo — no son instrumentos validados, son bancos de preguntas propuestos.'
                  : null}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
