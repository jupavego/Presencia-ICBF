import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient.js';
import Callout from '../ui/Callout.jsx';

const ROL_LABEL = { profesional_icbf: 'Profesional ICBF', admin: 'Admin' };

// Solo para admin: quiénes tienen cuenta en el sistema y una traza
// general de cuánto se ha diligenciado — ningún dato nuevo, son las
// mismas tablas que ya usan Bolsa de casos y el resto del panel, solo
// agregadas distinto. `creado_por is null` en `casos` ya distingue un
// caso que nació de un beneficiario autónomo (vía crear_caso_beneficiario
// sin sesión) de uno creado por un profesional en su nombre — ese dato
// ya existe en el esquema actual, no hizo falta ninguna migración.
export default function UsuariosTrazabilidad() {
  const [perfiles, setPerfiles] = useState([]);
  const [conteoCasos, setConteoCasos] = useState(null);
  const [conteoEvidencia, setConteoEvidencia] = useState(null);
  const [actividadPorProfesional, setActividadPorProfesional] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    Promise.all([
      supabase.from('profiles').select('id, nombre, rol, centro_zonal, creado_en').order('creado_en', { ascending: false }),
      supabase.from('casos').select('id, estado, creado_por, asignado_a'),
      supabase.from('formatos_oficiales_datos').select('id, caso_id'),
      supabase.from('perfilamiento_resultados').select('id, caso_id'),
    ]).then(([perfilesRes, casosRes, formatosRes, herramientasRes]) => {
      setPerfiles(perfilesRes.data || []);

      const casos = casosRes.data || [];
      const porEstado = {};
      let deBeneficiario = 0;
      const asignadoDeCaso = {};
      for (const c of casos) {
        porEstado[c.estado] = (porEstado[c.estado] || 0) + 1;
        if (c.creado_por === null) deBeneficiario += 1;
        asignadoDeCaso[c.id] = c.asignado_a;
      }
      setConteoCasos({ total: casos.length, porEstado, deBeneficiario });

      const formatos = formatosRes.data || [];
      const herramientas = herramientasRes.data || [];
      setConteoEvidencia({ formatos: formatos.length, herramientas: herramientas.length });

      // Aproximación, no atribución exacta: se cuenta contra el profesional
      // ACTUALMENTE asignado al caso al que pertenece cada fila, porque
      // formatos_oficiales_datos/perfilamiento_resultados no guardan quién
      // diligenció cada una — solo a qué caso pertenecen. Si un caso se
      // reasignó, el histórico queda del lado del profesional actual, no
      // de quien realmente lo llenó. Atribución exacta requeriría una
      // columna nueva (diligenciado_por) — no se agrega aquí sin pedirlo.
      const actividad = {};
      const contar = (casoId, clave) => {
        const uid = asignadoDeCaso[casoId];
        if (!uid) return; // caso en bolsa común o creado sin asignar todavía
        if (!actividad[uid]) actividad[uid] = { casos: new Set(), formatos: 0, herramientas: 0 };
        actividad[uid].casos.add(casoId);
        actividad[uid][clave] += 1;
      };
      for (const f of formatos) contar(f.caso_id, 'formatos');
      for (const h of herramientas) contar(h.caso_id, 'herramientas');
      setActividadPorProfesional(actividad);

      setCargando(false);
    });
  }, []);

  if (cargando) return null;

  return (
    <div className="ambito-block">
      <div className="ambito-block-head">
        <div className="ambito-block-title">
          <h3>Usuarios y trazabilidad</h3>
          <p>Visión de administrador: quién tiene cuenta, cuánto se ha diligenciado en total, y el comportamiento de diligenciamiento por profesional.</p>
        </div>
      </div>

      <div className="lectura-metrics">
        <div><b>{conteoCasos.total}</b><span>Casos totales</span></div>
        <div><b>{conteoCasos.porEstado.bolsa_comun || 0}</b><span>En bolsa común</span></div>
        <div><b>{conteoCasos.porEstado.asignado || 0}</b><span>Asignados</span></div>
        <div><b>{conteoCasos.porEstado.cerrado || 0}</b><span>Cerrados</span></div>
        <div><b>{conteoCasos.deBeneficiario}</b><span>Autoregistrados</span></div>
      </div>
      <div className="lectura-metrics" style={{ marginTop: 8 }}>
        <div><b>{conteoEvidencia.formatos}</b><span>Formatos oficiales diligenciados</span></div>
        <div><b>{conteoEvidencia.herramientas}</b><span>Resultados de herramientas</span></div>
      </div>

      <div style={{ marginTop: 18 }}>
        <span className="fnote-status">
          Quién ha diligenciado qué — por casos actualmente asignados a cada quien (no es un registro exacto de
          autoría: si un caso se reasignó, su histórico queda del lado del profesional actual).
        </span>
        {perfiles.map((p) => {
          const a = actividadPorProfesional[p.id];
          return (
            <div key={p.id} className="fbtn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span>
                {p.nombre || p.id.slice(0, 8)} {p.centro_zonal ? `· ${p.centro_zonal}` : ''}
                <span className="fnote-status" style={{ marginLeft: 8 }}>{ROL_LABEL[p.rol] || p.rol}</span>
              </span>
              <span className="fnote-status">
                {a
                  ? `${a.casos.size} caso${a.casos.size === 1 ? '' : 's'} · ${a.formatos} formato${a.formatos === 1 ? '' : 's'} · ${a.herramientas} herramienta${a.herramientas === 1 ? '' : 's'}`
                  : 'Sin diligenciamientos todavía'}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 14 }}>
        <Callout>
          Almacenamiento de evidencias en Drive: pendiente de integrar (la cuenta dedicada ya está creada) — se
          retoma en la próxima entrega.
        </Callout>
      </div>
    </div>
  );
}
