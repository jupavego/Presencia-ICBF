import { useEffect, useState } from 'react';
import Callout from '../ui/Callout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { supabase } from '../../lib/supabaseClient.js';

// Variante de selección múltiple de SelectorCasoAsignado.jsx — misma
// fuente de datos (casos asignados al usuario actual, estado='asignado'),
// pero para formatos donde un mismo diligenciamiento involucra a varios
// beneficiarios a la vez (hoy, F5: un encuentro comunitario reúne a
// varias familias). Controlado igual que CheckboxGrid (`selected` +
// `onChange`) para que quien lo usa decida qué hacer con la selección —
// F5 la usa tanto para guardar el encuentro en cada caso como para
// decidir a qué carpetas de Drive respaldar el documento generado.
export default function SelectorCasosAsignadosMultiple({ selected, onChange, label = 'Casos participantes' }) {
  const { session } = useAuth();
  const [misCasos, setMisCasos] = useState([]);

  useEffect(() => {
    if (!session) {
      setMisCasos([]);
      return;
    }
    supabase
      .from('casos')
      .select('id, nombre_participante, numero_peticion, municipio')
      .eq('asignado_a', session.user.id)
      .eq('estado', 'asignado')
      .then(({ data, error }) => {
        if (error) console.error('No se pudieron cargar los casos asignados:', error);
        setMisCasos(data || []);
      });
  }, [session]);

  if (!session) {
    return <Callout variant="warn">Inicie sesión para ver sus casos asignados.</Callout>;
  }

  function toggle(id) {
    onChange(selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id]);
  }

  return (
    <div>
      {label && <label style={{ marginBottom: 8 }}>{label}</label>}
      {misCasos.length === 0 ? (
        <Callout>No tiene casos asignados todavía. Asigne al menos uno desde Bolsa de casos.</Callout>
      ) : (
        <div className="check-grid cols-3">
          {misCasos.map((c) => (
            <label key={c.id}>
              <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />
              {c.nombre_participante || c.numero_peticion || c.id.slice(0, 8)}
              {c.municipio ? ` · ${c.municipio}` : ''}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
