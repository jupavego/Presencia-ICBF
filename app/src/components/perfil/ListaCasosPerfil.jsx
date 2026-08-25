import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient.js';

function nombreCaso(c) {
  return c.nombre_participante || c.numero_peticion || c.id.slice(0, 8);
}

// Tablero de evidencia para profesional_icbf/admin: a diferencia de
// Bolsa de casos (que es la cola de asignar/reasignar/liberar/cerrar),
// esta lista es de solo lectura salvo por "Ver detalle" — selecciona el
// caso como activo (mismo mecanismo que ya usa CasoBar.jsx) para que la
// sección de abajo en PerfilSesionPanel.jsx muestre su detalle completo.
// PostgREST no soporta GROUP BY arbitrario, así que los conteos se arman
// en el cliente sobre las filas crudas — a la escala de una bandeja de
// casos esto es trivial.
export default function ListaCasosPerfil({ esAdmin, uid, casoActivoId, onSeleccionar }) {
  const [casos, setCasos] = useState([]);
  const [evidencia, setEvidencia] = useState({});
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!uid) return;
    setCargando(true);
    const consultaCasos = esAdmin
      ? supabase.from('casos').select('id, nombre_participante, numero_peticion, municipio').eq('estado', 'asignado')
      : supabase.from('casos').select('id, nombre_participante, numero_peticion, municipio').eq('asignado_a', uid).eq('estado', 'asignado');

    consultaCasos.then(async ({ data: listaCasos, error }) => {
      if (error) {
        console.error('No se pudieron cargar los casos para el perfil de sesión:', error);
        setCasos([]);
        setCargando(false);
        return;
      }
      setCasos(listaCasos || []);
      const ids = (listaCasos || []).map((c) => c.id);
      if (!ids.length) {
        setEvidencia({});
        setCargando(false);
        return;
      }
      const [{ data: formatos }, { data: herramientas }] = await Promise.all([
        supabase.from('formatos_oficiales_datos').select('caso_id, formato_key').in('caso_id', ids),
        supabase.from('perfilamiento_resultados').select('caso_id, instrumento_id').in('caso_id', ids),
      ]);
      const resumen = {};
      for (const id of ids) resumen[id] = { formatos: new Set(), herramientas: new Set() };
      for (const f of formatos || []) resumen[f.caso_id]?.formatos.add(f.formato_key);
      for (const h of herramientas || []) resumen[h.caso_id]?.herramientas.add(h.instrumento_id);
      setEvidencia(resumen);
      setCargando(false);
    });
  }, [uid, esAdmin]);

  return (
    <details className="ambito-block">
      <summary className="ambito-block-head">
        <div className="ambito-block-title">
          <h3>{esAdmin ? 'Todos los casos asignados' : 'Mis casos asignados'} ({casos.length})</h3>
          <p>Evidencia diligenciada por caso — formatos oficiales y herramientas del Módulo de Perfilamiento.</p>
        </div>
      </summary>
      {cargando && <p className="fdesc">Cargando…</p>}
      {!cargando && casos.length === 0 && (
        <p className="fdesc">
          {esAdmin ? 'No hay casos asignados todavía.' : 'No tiene casos asignados — reclame uno desde Bolsa de casos.'}
        </p>
      )}
      {casos.map((c) => {
        const r = evidencia[c.id];
        return (
          <div
            key={c.id}
            className="fbtn"
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 8,
              background: c.id === casoActivoId ? 'var(--verde-oscuro)' : undefined,
            }}
          >
            <span>
              {nombreCaso(c)} {c.municipio ? `· ${c.municipio}` : ''}
              {r && (
                <span className="fnote-status" style={{ marginLeft: 8 }}>
                  {r.formatos.size} formato{r.formatos.size === 1 ? '' : 's'} oficial{r.formatos.size === 1 ? '' : 'es'} ·{' '}
                  {r.herramientas.size} herramienta{r.herramientas.size === 1 ? '' : 's'}
                </span>
              )}
            </span>
            <button type="button" className="fbtn2" onClick={() => onSeleccionar(c.id)}>Ver detalle</button>
          </div>
        );
      })}
    </details>
  );
}
