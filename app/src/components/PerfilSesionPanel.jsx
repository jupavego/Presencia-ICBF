import { useMemo } from 'react';
import Callout from './ui/Callout.jsx';
import PatternCard from './ui/PatternCard.jsx';
import { AMBITOS } from '../data/ambitos.js';
import { usePerfilSesion } from '../context/PerfilSesionContext.jsx';

const NIVEL_LABEL = { fortaleza: 'Fortalezas', oportunidad: 'Oportunidades de fortalecimiento', profundizacion: 'Situaciones a priorizar' };

// Primera pieza del Producto 8 (integración entre esferas) que no
// requiere backend: sintetiza en un solo lugar lo que las 23
// herramientas del módulo ya produjeron dentro de esta misma visita,
// leyendo el registro compartido de PerfilSesionContext.js. No define
// reglas nuevas de cruce entre esferas específicas (eso es la extensión
// del motor de recomendaciones, Producto 9, que vendría después) — aquí
// se agregan los patrones ya calculados por cada herramienta, agrupados
// por nivel, para que el equipo tenga una vista consolidada sin abrir
// una por una.
//
// No incluye el Mapa de Pertenencia (F1): usa su propio motor de lectura
// de red (lecturaRed.js), con un contrato distinto al de las 23
// herramientas de este módulo, y queda fuera del alcance de esta
// primera versión.
export default function PerfilSesionPanel({ onOpenFormat }) {
  const { registro } = usePerfilSesion();

  const infoHerramienta = useMemo(() => {
    const mapa = {};
    for (const ambito of AMBITOS) {
      for (const h of ambito.herramientas) {
        if (!h.componentKey || h.componentKey === 'F1' || mapa[h.componentKey]) continue;
        mapa[h.componentKey] = { ...h, esferaCodigo: ambito.codigo, esferaNombre: ambito.nombre };
      }
    }
    return mapa;
  }, []);

  const totalHerramientas = Object.keys(infoHerramienta).length;
  const completadas = Object.keys(registro).filter((id) => infoHerramienta[id]);
  const patronesConOrigen = completadas.flatMap((id) =>
    (registro[id].patrones || []).map((p) => ({ ...p, origenId: id, origenNombre: infoHerramienta[id]?.nombre })),
  );
  const porNivel = { fortaleza: [], oportunidad: [], profundizacion: [] };
  for (const p of patronesConOrigen) {
    if (porNivel[p.nivel]) porNivel[p.nivel].push(p);
  }

  return (
    <section className="stage-panel">
      <div className="stage-head">
        <div className="eyebrow">Módulo de Perfilamiento · Perfil de sesión</div>
        <h2>Perfil de la sesión</h2>
        <p>
          Consolida los patrones que ya arrojaron las herramientas completadas en esta misma visita — no reemplaza
          abrir cada una, es una vista de conjunto para no tener que recordarlas todas. Se pierde al recargar la
          página, igual que las respuestas de cada formulario individual.
        </p>
      </div>

      <div className="lectura-metrics">
        <div><b>{completadas.length}/{totalHerramientas}</b><span>Herramientas completadas</span></div>
        <div><b>{porNivel.fortaleza.length}</b><span>Fortalezas</span></div>
        <div><b>{porNivel.oportunidad.length}</b><span>Oportunidades</span></div>
        <div><b>{porNivel.profundizacion.length}</b><span>A priorizar</span></div>
      </div>

      {completadas.length === 0 ? (
        <Callout>
          Todavía no se ha completado ninguna herramienta en esta visita. Abra cualquiera desde{' '}
          <b>Herramientas</b> en el menú lateral — al completarla, su perfil descriptivo aparecerá aquí también.
        </Callout>
      ) : (
        <>
          {['profundizacion', 'oportunidad', 'fortaleza'].map((nivel) => porNivel[nivel].length > 0 && (
            <div key={nivel} className="ambito-block">
              <div className="ambito-block-head">
                <div className="ambito-block-title">
                  <h3>{NIVEL_LABEL[nivel]}</h3>
                </div>
              </div>
              <div className="pattern-list">
                {porNivel[nivel].map((p, i) => (
                  <div key={`${p.origenId}_${p.codigo}_${i}`}>
                    <div className="fnote-status" style={{ marginBottom: 4 }}>{p.origenNombre}</div>
                    <PatternCard patron={p} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      <div className="ambito-block">
        <div className="ambito-block-head">
          <div className="ambito-block-title">
            <h3>Cobertura por esfera</h3>
            <p>Qué se ha completado hasta ahora, esfera por esfera.</p>
          </div>
        </div>
        {AMBITOS.map((ambito) => {
          const herramientasEsfera = ambito.herramientas.filter((h) => h.componentKey && h.componentKey !== 'F1');
          if (herramientasEsfera.length === 0) return null;
          return (
            <div key={ambito.codigo} style={{ marginBottom: 10 }}>
              <span className="fnote-status">{ambito.codigo} · {ambito.nombre}</span>
              <div className="format-grid">
                {herramientasEsfera.map((h) => {
                  const hecha = !!registro[h.componentKey]?.completo;
                  return (
                    <button
                      key={ambito.codigo + h.codigo}
                      type="button"
                      className="fbtn"
                      onClick={() => onOpenFormat(h)}
                      style={{ textAlign: 'left' }}
                    >
                      {hecha ? '✓' : '○'} {h.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
