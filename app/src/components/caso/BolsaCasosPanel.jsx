import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Callout from '../ui/Callout.jsx';

function nombreCaso(c) {
  return c.nombre_participante || c.numero_peticion || c.id.slice(0, 8);
}

function nombreProfesional(profesionales, uid) {
  if (!uid) return null;
  const p = profesionales.find((p) => p.id === uid);
  return p?.nombre || uid.slice(0, 8);
}

// Fila de una línea: nombre + etiqueta a la izquierda, acciones expuestas
// como íconos a la derecha — con solo 2-3 acciones por fila no hace falta
// esconderlas detrás de un clic de más (reemplaza el acordeón anterior).
function FilaCaso({ caso, tag, children }) {
  return (
    <div className="caso-row">
      <span className="caso-row-name">{nombreCaso(caso)}</span>
      {tag && <span className="caso-row-tag">{tag}</span>}
      <div className="caso-row-actions">{children}</div>
    </div>
  );
}

function IconAction({ onClick, title, danger, children }) {
  return (
    <button type="button" className={`icon-btn sm${danger ? ' danger' : ''}`} onClick={onClick} title={title} aria-label={title}>
      {children}
    </button>
  );
}

// Panel de gestión de casos para el rol profesional ICBF/admin — ver
// 0003_roles_bolsa_asignacion.sql. La RLS ya acota lo que cada consulta
// puede traer (bolsa común, lo propio, o todo si es admin); este
// componente solo decide qué mostrar y qué acción disparar, no duplica
// esa validación de acceso.
export default function BolsaCasosPanel() {
  const { session, profile } = useAuth();
  const esAdmin = profile?.rol === 'admin';
  const uid = session?.user?.id;

  const [bolsaComun, setBolsaComun] = useState([]);
  const [misCasos, setMisCasos] = useState([]);
  const [todosAsignados, setTodosAsignados] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    if (!uid) return;
    setCargando(true);
    setError(null);
    try {
      const [{ data: bolsa }, { data: mios }] = await Promise.all([
        supabase.from('casos').select('id, nombre_participante, numero_peticion, municipio, creado_en').eq('estado', 'bolsa_comun').order('creado_en', { ascending: false }),
        supabase.from('casos').select('id, nombre_participante, numero_peticion, municipio, asignado_en').eq('asignado_a', uid).eq('estado', 'asignado').order('asignado_en', { ascending: false }),
      ]);
      setBolsaComun(bolsa || []);
      setMisCasos(mios || []);

      if (esAdmin) {
        const [{ data: todos }, { data: staff }] = await Promise.all([
          supabase.from('casos').select('id, nombre_participante, numero_peticion, asignado_a, asignado_en').eq('estado', 'asignado').order('asignado_en', { ascending: false }),
          supabase.from('profiles').select('id, nombre, rol').eq('rol', 'profesional_icbf'),
        ]);
        setTodosAsignados(todos || []);
        setProfesionales(staff || []);
      }
    } catch (err) {
      console.error('No se pudo cargar la bolsa de casos:', err);
      setError('No se pudo cargar la información. Intente de nuevo.');
    } finally {
      setCargando(false);
    }
  }, [uid, esAdmin]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function asignarme(casoId) {
    const { error: errUpdate } = await supabase
      .from('casos')
      .update({ asignado_a: uid, estado: 'asignado', asignado_en: new Date().toISOString() })
      .eq('id', casoId);
    if (errUpdate) { setError('No se pudo asignar el caso.'); return; }
    await supabase.from('caso_asignaciones').insert({ caso_id: casoId, asignado_a: uid, asignado_por: uid });
    cargar();
  }

  async function liberar(casoId) {
    const { error: errUpdate } = await supabase
      .from('casos')
      .update({ asignado_a: null, estado: 'bolsa_comun', asignado_en: null })
      .eq('id', casoId);
    if (errUpdate) { setError('No se pudo liberar el caso.'); return; }
    await supabase.from('caso_asignaciones').update({ liberado_en: new Date().toISOString() }).eq('caso_id', casoId).is('liberado_en', null);
    cargar();
  }

  async function cerrar(casoId) {
    const { error: errUpdate } = await supabase.from('casos').update({ estado: 'cerrado' }).eq('id', casoId);
    if (errUpdate) { setError('No se pudo cerrar el caso.'); return; }
    cargar();
  }

  async function eliminar(casoId) {
    if (!confirm('¿Eliminar este caso? Solo hágalo si es una entrada duplicada o de prueba sin datos reales — el expediente real debería cerrarse, no eliminarse.')) return;
    const { error: errUpdate } = await supabase.from('casos').update({ estado: 'eliminado' }).eq('id', casoId);
    if (errUpdate) { setError('No se pudo eliminar el caso — verifique que tenga rol admin.'); return; }
    cargar();
  }

  async function reasignar(casoId, nuevoUid) {
    if (!nuevoUid) return;
    await supabase.from('caso_asignaciones').update({ liberado_en: new Date().toISOString() }).eq('caso_id', casoId).is('liberado_en', null);
    await supabase.from('caso_asignaciones').insert({ caso_id: casoId, asignado_a: nuevoUid, asignado_por: uid });
    const { error: errUpdate } = await supabase
      .from('casos')
      .update({ asignado_a: nuevoUid, estado: 'asignado', asignado_en: new Date().toISOString() })
      .eq('id', casoId);
    if (errUpdate) { setError('No se pudo reasignar el caso.'); return; }
    cargar();
  }

  return (
    <section className="stage-panel bolsa-panel">
      <div className="stage-head">
        <div className="eyebrow">Gestión de casos</div>
        <h2>Bolsa de casos</h2>
        <p>
          Los casos que llegan por Petición de Acceso (con o sin acompañamiento de un profesional) entran a la
          bolsa común sin asignar. Reclame uno para trabajarlo — queda en su bandeja hasta que lo libere, lo
          cierre o se lo reasignen.
        </p>
      </div>

      {error && <Callout variant="warn">{error}</Callout>}
      {cargando && <p className="fdesc">Cargando…</p>}

      <div className="ambito-block">
        <div className="ambito-block-head">
          <div className="ambito-block-title">
            <h3>Bolsa común ({bolsaComun.length})</h3>
            <p>Casos sin asignar, disponibles para reclamar.</p>
          </div>
        </div>
        {bolsaComun.length === 0 ? (
          <p className="fdesc">Nada pendiente de asignar por ahora.</p>
        ) : (
          <div className="caso-list">
            {bolsaComun.map((c) => (
              <FilaCaso key={c.id} caso={c} tag={c.municipio}>
                <IconAction title="Asignarme este caso" onClick={() => asignarme(c.id)}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="8 12.5 10.5 15 16 9" />
                  </svg>
                </IconAction>
              </FilaCaso>
            ))}
          </div>
        )}
      </div>

      <div className="ambito-block">
        <div className="ambito-block-head">
          <div className="ambito-block-title">
            <h3>Mis casos asignados ({misCasos.length})</h3>
            <p>Casos que tiene en su bandeja de trabajo.</p>
          </div>
        </div>
        {misCasos.length === 0 ? (
          <p className="fdesc">No tiene casos asignados todavía.</p>
        ) : (
          <div className="caso-list">
            {misCasos.map((c) => (
              <FilaCaso key={c.id} caso={c} tag={c.municipio}>
                <IconAction title="Liberar (vuelve a la bolsa común)" onClick={() => liberar(c.id)}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 14 4 9 9 4" />
                    <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                  </svg>
                </IconAction>
                <IconAction title="Cerrar caso" onClick={() => cerrar(c.id)}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="21 8 21 21 3 21 3 8" />
                    <rect x="1" y="3" width="22" height="5" />
                    <line x1="10" y1="12" x2="14" y2="12" />
                  </svg>
                </IconAction>
                {esAdmin && (
                  <IconAction title="Eliminar caso" danger onClick={() => eliminar(c.id)}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </IconAction>
                )}
              </FilaCaso>
            ))}
          </div>
        )}
      </div>

      {esAdmin && (
        <div className="ambito-block">
          <div className="ambito-block-head">
            <div className="ambito-block-title">
              <h3>Todos los casos asignados ({todosAsignados.length})</h3>
              <p>Vista de administración — reasignar mueve el caso a otro profesional, cerrando la asignación actual.</p>
            </div>
          </div>
          {todosAsignados.length === 0 ? (
            <p className="fdesc">No hay casos asignados en el sistema todavía.</p>
          ) : (
            <div className="caso-list">
              {todosAsignados.map((c) => (
                <FilaCaso key={c.id} caso={c} tag={`ICBF · ${nombreProfesional(profesionales, c.asignado_a)}`}>
                  <select defaultValue="" onChange={(e) => { reasignar(c.id, e.target.value); e.target.value = ''; }}>
                    <option value="" disabled>Reasignar a…</option>
                    {profesionales.filter((p) => p.id !== c.asignado_a).map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre || p.id.slice(0, 8)}</option>
                    ))}
                  </select>
                  <IconAction title="Eliminar caso" danger onClick={() => eliminar(c.id)}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </IconAction>
                </FilaCaso>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
