import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Callout from '../ui/Callout.jsx';

function nombreCaso(c) {
  return c.nombre_participante || c.numero_peticion || c.id.slice(0, 8);
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

      <div className="format-grid" style={{ marginTop: 8 }}>
        <div className="ambito-block">
          <h3>Bolsa común ({bolsaComun.length})</h3>
          {bolsaComun.length === 0 && <p className="fdesc">Nada pendiente de asignar por ahora.</p>}
          {bolsaComun.map((c) => (
            <div key={c.id} className="fbtn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span>{nombreCaso(c)} {c.municipio ? `· ${c.municipio}` : ''}</span>
              <button type="button" className="fbtn2 primary" onClick={() => asignarme(c.id)}>Asignarme</button>
            </div>
          ))}
        </div>

        <div className="ambito-block">
          <h3>Mis casos asignados ({misCasos.length})</h3>
          {misCasos.length === 0 && <p className="fdesc">No tiene casos asignados todavía.</p>}
          {misCasos.map((c) => (
            <div key={c.id} className="fbtn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span>{nombreCaso(c)} {c.municipio ? `· ${c.municipio}` : ''}</span>
              <span style={{ display: 'flex', gap: 6 }}>
                <button type="button" className="fbtn2" onClick={() => liberar(c.id)}>Liberar</button>
                <button type="button" className="fbtn2" onClick={() => cerrar(c.id)}>Cerrar</button>
                {esAdmin && (
                  <button type="button" className="fbtn2" onClick={() => eliminar(c.id)}>Eliminar</button>
                )}
              </span>
            </div>
          ))}
        </div>

        {esAdmin && (
          <div className="ambito-block">
            <h3>Todos los casos asignados ({todosAsignados.length})</h3>
            <p className="fdesc">Vista de administración — reasignar mueve el caso a otro profesional, cerrando la asignación actual.</p>
            {todosAsignados.map((c) => (
              <div key={c.id} className="fbtn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span>{nombreCaso(c)}</span>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <select defaultValue="" onChange={(e) => { reasignar(c.id, e.target.value); e.target.value = ''; }}>
                    <option value="" disabled>Reasignar a…</option>
                    {profesionales.filter((p) => p.id !== c.asignado_a).map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre || p.id.slice(0, 8)}</option>
                    ))}
                  </select>
                  <button type="button" className="fbtn2" onClick={() => eliminar(c.id)}>Eliminar</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
