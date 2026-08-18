import { useMemo } from 'react';
import Callout from './ui/Callout.jsx';
import PatternCard from './ui/PatternCard.jsx';
import { AMBITOS } from '../data/ambitos.js';
import { usePerfilSesion } from '../context/PerfilSesionContext.jsx';
import { useCaso } from '../context/CasoContext.jsx';
import { useCompromisos } from '../context/CompromisosContext.jsx';
import { formatoFecha } from '../lib/exportOficial.js';

const NIVEL_LABEL = { fortaleza: 'Fortalezas', oportunidad: 'Oportunidades de fortalecimiento', profundizacion: 'Situaciones a priorizar' };

// Primera pieza del Producto 8 (integración entre esferas): sintetiza en
// un solo lugar lo que las 25 herramientas del módulo ya produjeron para
// el caso activo, leyendo el registro compartido de
// PerfilSesionContext.js — que ahora persiste en Supabase, no solo en
// memoria de la visita. No define reglas nuevas de cruce entre esferas
// específicas (eso es la extensión del motor de recomendaciones,
// Producto 9, que vendría después) — aquí se agregan los patrones ya
// calculados por cada herramienta, agrupados por nivel, para que el
// equipo tenga una vista consolidada sin abrir una por una.
//
// No incluye el Mapa de Pertenencia (F1): usa su propio motor de lectura
// de red (lecturaRed.js), con un contrato distinto al de las 24
// herramientas de este módulo, y queda fuera del alcance de esta
// primera versión.
export default function PerfilSesionPanel({ onOpenFormat }) {
  const { registro } = usePerfilSesion();
  const { caso, casoActivoId } = useCaso();
  const { compromisos } = useCompromisos();

  const compromisosPendientes = compromisos.filter((c) => c.estado === 'Pendiente');
  const compromisosEnProceso = compromisos.filter((c) => c.estado === 'En proceso');
  const compromisosCumplidos = compromisos.filter((c) => c.estado === 'Cumplido');

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

  // Calificación transversal (1-5): promedio de lo que ya calculó
  // motorInstrumento.js por herramienta — ausente/null se ignora, nunca
  // cuenta como 0 (herramientas completadas antes de este cambio, o sin
  // dato suficiente, no deben distorsionar el promedio).
  const calificacionesCompletadas = completadas
    .map((id) => registro[id].calificacion)
    .filter((c) => c != null);
  const calificacionGlobal = calificacionesCompletadas.length
    ? Math.round((calificacionesCompletadas.reduce((a, b) => a + b, 0) / calificacionesCompletadas.length) * 10) / 10
    : null;

  const calificacionPorEsfera = {};
  for (const ambito of AMBITOS) {
    const valores = ambito.herramientas
      .filter((h) => h.componentKey && h.componentKey !== 'F1')
      .map((h) => registro[h.componentKey]?.calificacion)
      .filter((c) => c != null);
    calificacionPorEsfera[ambito.codigo] = valores.length
      ? Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 10) / 10
      : null;
  }

  return (
    <section className="stage-panel">
      <div className="stage-head">
        <div className="eyebrow">Módulo de Perfilamiento · Perfil de sesión</div>
        <h2>Perfil de la sesión</h2>
        <p>
          Consolida los patrones que ya arrojaron las herramientas completadas para el caso activo — no reemplaza
          abrir cada una, es una vista de conjunto para no tener que recordarlas todas.
        </p>
      </div>

      {!casoActivoId ? (
        <Callout variant="warn">
          No hay un caso activo. Los resultados que complete quedarán solo en esta visita — para que se guarden y
          estén disponibles la próxima vez, registre una <b>Petición de Vinculación</b> (etapa 01) o seleccione un
          caso existente desde la barra superior.
        </Callout>
      ) : (
        <Callout>
          Caso activo: <b>{caso?.nombre_participante || casoActivoId.slice(0, 8)}</b> — los resultados se guardan
          automáticamente en el servidor.
        </Callout>
      )}

      <div className="lectura-metrics">
        <div><b>{completadas.length}/{totalHerramientas}</b><span>Herramientas completadas</span></div>
        <div><b>{calificacionGlobal != null ? `${calificacionGlobal}/5` : '—'}</b><span>Calificación global</span></div>
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

      {casoActivoId && compromisos.length > 0 && (
        <div className="ambito-block">
          <div className="ambito-block-head">
            <div className="ambito-block-title">
              <h3>Compromisos del caso</h3>
              <p>Acuerdos registrados desde cualquier formato del caso (hoy: F6), reunidos en un solo lugar.</p>
            </div>
          </div>
          <div className="lectura-metrics">
            <div><b>{compromisosPendientes.length}</b><span>Pendientes</span></div>
            <div><b>{compromisosEnProceso.length}</b><span>En proceso</span></div>
            <div><b>{compromisosCumplidos.length}</b><span>Cumplidos</span></div>
          </div>
          {compromisosPendientes.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {compromisosPendientes.map((c) => (
                <div key={c.id} className="repeater-item" style={{ marginBottom: 8 }}>
                  <div>{c.descripcion || '(sin descripción)'}</div>
                  <div className="fnote-status" style={{ marginTop: 4 }}>
                    {c.responsable}{c.fecha ? ` · ${formatoFecha(c.fecha)}` : ''} · desde {c.origen || '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
              <span className="fnote-status">
                {ambito.codigo} · {ambito.nombre}
                {calificacionPorEsfera[ambito.codigo] != null && ` · ${calificacionPorEsfera[ambito.codigo]}/5`}
              </span>
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
