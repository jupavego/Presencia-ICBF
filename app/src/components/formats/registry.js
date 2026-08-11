// Registro central: asocia el `componentKey` usado en src/data/etapas.js
// con el componente React que digitaliza cada formato.
import F1MapaPertenencia from './F1MapaPertenencia.jsx';
import F3AcuerdoVinculacion from './F3AcuerdoVinculacion.jsx';
import F4EncuestaSatisfaccion from './F4EncuestaSatisfaccion.jsx';
import F5EncuentrosComunitarios from './F5EncuentrosComunitarios.jsx';
import F6AcompanamientoEntornoFamiliar from './F6AcompanamientoEntornoFamiliar.jsx';
import F7PerfilSocioFamiliar from './F7PerfilSocioFamiliar.jsx';
import F8Cronograma from './F8Cronograma.jsx';
import F10SeguimientoRecurso from './F10SeguimientoRecurso.jsx';

export const FORMAT_REGISTRY = {
  F1: F1MapaPertenencia,
  F3: F3AcuerdoVinculacion,
  F4: F4EncuestaSatisfaccion,
  F5: F5EncuentrosComunitarios,
  F6: F6AcompanamientoEntornoFamiliar,
  F7: F7PerfilSocioFamiliar,
  F8: F8Cronograma,
  F10: F10SeguimientoRecurso,
};
