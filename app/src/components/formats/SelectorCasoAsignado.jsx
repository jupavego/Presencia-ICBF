import { useEffect, useState } from 'react';
import { SelectField } from '../ui/Field.jsx';
import Callout from '../ui/Callout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCaso } from '../../context/CasoContext.jsx';
import { supabase } from '../../lib/supabaseClient.js';

// Selector de "mis casos asignados" para formatos oficiales que diligencia
// el equipo ICBF (F1, F3, F4, F6, F8, F10 — no las 25 herramientas del
// Módulo de Perfilamiento, que ya se guardan sobre el caso activo sin
// ambigüedad). Es la pieza que deja explícito a qué beneficiario
// pertenece cada evidencia diligenciada — necesaria para poder ubicar
// después cada archivo en la carpeta correcta del expediente (Drive).
// Al elegir un caso, además de invocar `onSeleccionar(caso)` para que el
// formato prellene lo que le sirva, lo deja como caso activo
// (seleccionarCaso) para que el guardado quede sobre el registro
// correcto. Sin sesión (beneficiario/invitado) no se renderiza — no
// aplica, ese caso ya es el único que puede tener activo.
export default function SelectorCasoAsignado({ onSeleccionar, label = 'Seleccionar de mis casos asignados' }) {
  const { session } = useAuth();
  const { seleccionarCaso } = useCaso();
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

  if (!session) return null;

  function elegir(casoId) {
    if (!casoId) return;
    const caso = misCasos.find((c) => c.id === casoId);
    if (!caso) return;
    seleccionarCaso(casoId);
    onSeleccionar?.(caso);
  }

  return (
    <div className="grid" style={{ marginBottom: 12 }}>
      <SelectField
        span="full"
        label={label}
        tip="Beneficiarios cuyo caso ya está asignado a este usuario ICBF — al elegir uno, este formato queda vinculado a ese caso, para que la evidencia quede identificada correctamente."
        options={misCasos.map((c) => ({
          value: c.id,
          label: `${c.nombre_participante || c.numero_peticion || c.id.slice(0, 8)}${c.municipio ? ` · ${c.municipio}` : ''}`,
        }))}
        value=""
        onChange={(e) => elegir(e.target.value)}
      />
      {misCasos.length === 0 && (
        <Callout>No tiene casos asignados todavía — puede seguir diligenciando con el texto libre de abajo, o reclamar uno desde Bolsa de casos.</Callout>
      )}
    </div>
  );
}
