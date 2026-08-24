import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient.js';
import { useCaso } from '../../context/CasoContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { exportarResumenMaestro } from '../../lib/exportMaestro.js';

// Barra compacta en el TopBar: qué caso está activo y un selector simple
// para cambiar entre los ya existentes. La creación de un caso nuevo pasa
// por Petición de Acceso (etapa 01) — es el punto de la app donde hoy ya
// se inicia un caso, no se duplica ese flujo aquí.
//
// Sin sesión (modo invitado), las políticas RLS de Supabase ya rechazan
// la lectura/escritura de `casos` — no tiene sentido ni consultarlos ni
// ofrecer "exportar resumen maestro" (saldría vacío), así que esa parte
// del panel se reemplaza por una nota explicando que hay que iniciar
// sesión para guardar y consultar casos.
export default function CasoBar() {
  const { caso, casoActivoId, seleccionarCaso, cerrarCaso } = useCaso();
  const { session } = useAuth();
  const [casos, setCasos] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [errorExportar, setErrorExportar] = useState(null);

  async function exportarMaestro() {
    setExportando(true);
    setErrorExportar(null);
    try {
      await exportarResumenMaestro();
    } catch (err) {
      console.error('No se pudo generar el resumen maestro:', err);
      setErrorExportar('No se pudo generar el archivo. Intente de nuevo.');
    } finally {
      setExportando(false);
    }
  }

  useEffect(() => {
    if (!abierto || !session) return;
    supabase
      .from('casos')
      .select('id, numero_peticion, nombre_participante, creado_en')
      .order('creado_en', { ascending: false })
      .limit(50)
      .then(({ data }) => setCasos(data || []));
  }, [abierto, session]);

  const estadoCaso = caso
    ? `Caso: ${caso.nombre_participante || caso.numero_peticion || caso.id.slice(0, 8)}`
    : casoActivoId
      ? 'Cargando caso…'
      : 'Sin caso activo';

  return (
    <div className="topbar-caso" style={{ position: 'relative' }}>
      <button type="button" className="icon-btn" onClick={() => setAbierto((v) => !v)} title={estadoCaso} aria-label={estadoCaso}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {caso && <span className="notif-dot" />}
      </button>
      {abierto && (
        <div
          style={{
            position: 'absolute', top: '110%', right: 0, background: '#fff', border: '1px solid var(--border)',
            borderRadius: 10, boxShadow: 'var(--shadow)', padding: 8, minWidth: 240, zIndex: 20,
          }}
        >
          <p className="fnote-status" style={{ padding: '4px 6px 8px' }}>{estadoCaso}</p>
          {!session ? (
            <p className="fdesc" style={{ padding: 6 }}>Inicie sesión para guardar y consultar casos — puede seguir diligenciando formatos y herramientas sin guardar mientras tanto.</p>
          ) : (
            <>
              {casos.length === 0 && <p className="fdesc" style={{ padding: 6 }}>Ningún caso creado todavía — cree uno desde Petición de Acceso.</p>}
              {casos.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="fbtn"
                  style={{ display: 'block', width: '100%', textAlign: 'left', marginTop: 4, background: c.id === casoActivoId ? 'var(--verde-oscuro)' : undefined }}
                  onClick={() => { seleccionarCaso(c.id); setAbierto(false); }}
                >
                  {c.nombre_participante || c.numero_peticion || c.id.slice(0, 8)}
                </button>
              ))}
              <button
                type="button"
                className="fbtn"
                style={{ display: 'block', width: '100%', marginTop: 8, background: 'var(--gray-bg)', color: '#3a4d47' }}
                disabled={exportando}
                onClick={exportarMaestro}
              >
                {exportando ? 'Generando…' : 'Exportar resumen maestro'}
              </button>
              {errorExportar && <p className="fdesc" style={{ padding: '4px 6px', color: '#a33' }}>{errorExportar}</p>}
            </>
          )}
          {caso && (
            <button type="button" className="fbtn" style={{ display: 'block', width: '100%', marginTop: 8, background: 'var(--gray-bg)', color: '#3a4d47' }} onClick={() => { cerrarCaso(); setAbierto(false); }}>
              Cerrar caso activo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
