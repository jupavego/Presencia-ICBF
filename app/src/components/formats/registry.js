// Registro central: asocia el `componentKey` usado en src/data/etapas.js
// con el componente React que digitaliza cada formato.
import PeticionAcceso from './PeticionAcceso.jsx';
import F1MapaPertenencia from './F1MapaPertenencia.jsx';
import F3AcuerdoVinculacion from './F3AcuerdoVinculacion.jsx';
import F4EncuestaSatisfaccion from './F4EncuestaSatisfaccion.jsx';
import F5EncuentrosComunitarios from './F5EncuentrosComunitarios.jsx';
import F6AcompanamientoEntornoFamiliar from './F6AcompanamientoEntornoFamiliar.jsx';
import F7PerfilSocioFamiliar from './F7PerfilSocioFamiliar.jsx';
import F8Cronograma from './F8Cronograma.jsx';
import F10SeguimientoRecurso from './F10SeguimientoRecurso.jsx';
import WHO5Herramienta from '../herramientas/WHO5Herramienta.jsx';
import MSPSSHerramienta from '../herramientas/MSPSSHerramienta.jsx';
import FACES20espHerramienta from '../herramientas/FACES20espHerramienta.jsx';
import AutoeficaciaHerramienta from '../herramientas/AutoeficaciaHerramienta.jsx';
import FQOLHerramienta from '../herramientas/FQOLHerramienta.jsx';
import McMasterFADHerramienta from '../herramientas/McMasterFADHerramienta.jsx';
import FRASHibridoHerramienta from '../herramientas/FRASHibridoHerramienta.jsx';
import EmpoderamientoFamiliarHerramienta from '../herramientas/EmpoderamientoFamiliarHerramienta.jsx';
import AutoestimaHerramienta from '../herramientas/AutoestimaHerramienta.jsx';
import HonestidadHumildadHerramienta from '../herramientas/HonestidadHumildadHerramienta.jsx';
import ResilienciaIndividualHerramienta from '../herramientas/ResilienciaIndividualHerramienta.jsx';
import FortalezasPorVirtudHerramienta from '../herramientas/FortalezasPorVirtudHerramienta.jsx';
import InteresesTipologicosHerramienta from '../herramientas/InteresesTipologicosHerramienta.jsx';
import PracticasCrianzaHerramienta from '../herramientas/PracticasCrianzaHerramienta.jsx';
import CalidadVidaDominiosHerramienta from '../herramientas/CalidadVidaDominiosHerramienta.jsx';
import ExploracionEducativaHerramienta from '../herramientas/ExploracionEducativaHerramienta.jsx';
import ExploracionOcupacionalHerramienta from '../herramientas/ExploracionOcupacionalHerramienta.jsx';
import CaracterizacionSocioeconomicaHerramienta from '../herramientas/CaracterizacionSocioeconomicaHerramienta.jsx';
import ExploracionCulturalHerramienta from '../herramientas/ExploracionCulturalHerramienta.jsx';
import ExploracionTerritorialHerramienta from '../herramientas/ExploracionTerritorialHerramienta.jsx';
import ProyectoDeVidaHerramienta from '../herramientas/ProyectoDeVidaHerramienta.jsx';

export const FORMAT_REGISTRY = {
  PETICION: PeticionAcceso,
  F1: F1MapaPertenencia,
  F3: F3AcuerdoVinculacion,
  F4: F4EncuestaSatisfaccion,
  F5: F5EncuentrosComunitarios,
  F6: F6AcompanamientoEntornoFamiliar,
  F7: F7PerfilSocioFamiliar,
  F8: F8Cronograma,
  F10: F10SeguimientoRecurso,
  WHO5: WHO5Herramienta,
  MSPSS: MSPSSHerramienta,
  FACES20ESP: FACES20espHerramienta,
  AUTOEF: AutoeficaciaHerramienta,
  FQOL: FQOLHerramienta,
  FAD: McMasterFADHerramienta,
  FRAS_HIB: FRASHibridoHerramienta,
  EMPOFAM: EmpoderamientoFamiliarHerramienta,
  AUTOESTIMA: AutoestimaHerramienta,
  HONHUM: HonestidadHumildadHerramienta,
  RESIND: ResilienciaIndividualHerramienta,
  FORTVIRT: FortalezasPorVirtudHerramienta,
  RIASECHIB: InteresesTipologicosHerramienta,
  CRIANZA: PracticasCrianzaHerramienta,
  CVIDAHIB: CalidadVidaDominiosHerramienta,
  EDU: ExploracionEducativaHerramienta,
  OCUP: ExploracionOcupacionalHerramienta,
  SOCIOECO: CaracterizacionSocioeconomicaHerramienta,
  CULTURAL: ExploracionCulturalHerramienta,
  TERRITORIO: ExploracionTerritorialHerramienta,
  PROYVIDA: ProyectoDeVidaHerramienta,
};
