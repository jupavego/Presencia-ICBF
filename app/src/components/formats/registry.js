// Registro central: asocia el `componentKey` usado en src/data/etapas.js
// con el componente React que digitaliza cada formato.
//
// Cada entrada usa React.lazy en vez de un import estático: F3/F4/F5/F6/F7/
// F8/F10 cargan docxtemplater+exceljs+pizzip (exportOficial.js/exportMaestro.js)
// para generar los Word/Excel oficiales, y antes de esto se descargaban
// siempre, para cualquier visitante, aunque nunca abriera un formato —
// FormatViewer.jsx se monta siempre en App.jsx, y este registro se
// importaba entero con él. Con lazy, Vite genera un chunk aparte por
// formato y solo se descarga cuando alguien efectivamente lo abre (ver
// Suspense en FormatViewer.jsx).
import { lazy } from 'react';

export const FORMAT_REGISTRY = {
  PETICION: lazy(() => import('./PeticionAcceso.jsx')),
  F1: lazy(() => import('./F1MapaPertenencia.jsx')),
  F3: lazy(() => import('./F3AcuerdoVinculacion.jsx')),
  F4: lazy(() => import('./F4EncuestaSatisfaccion.jsx')),
  F5: lazy(() => import('./F5EncuentrosComunitarios.jsx')),
  F6: lazy(() => import('./F6AcompanamientoEntornoFamiliar.jsx')),
  F7: lazy(() => import('./F7PerfilSocioFamiliar.jsx')),
  F8: lazy(() => import('./F8Cronograma.jsx')),
  F10: lazy(() => import('./F10SeguimientoRecurso.jsx')),
  WHO5: lazy(() => import('../herramientas/WHO5Herramienta.jsx')),
  BFI2: lazy(() => import('../herramientas/BFI2Herramienta.jsx')),
  MSPSS: lazy(() => import('../herramientas/MSPSSHerramienta.jsx')),
  FACES20ESP: lazy(() => import('../herramientas/FACES20espHerramienta.jsx')),
  AUTOEF: lazy(() => import('../herramientas/AutoeficaciaHerramienta.jsx')),
  FQOL: lazy(() => import('../herramientas/FQOLHerramienta.jsx')),
  FAD: lazy(() => import('../herramientas/McMasterFADHerramienta.jsx')),
  FRAS_HIB: lazy(() => import('../herramientas/FRASHibridoHerramienta.jsx')),
  FRAS_REAL: lazy(() => import('../herramientas/FRASRealHerramienta.jsx')),
  EMPOFAM: lazy(() => import('../herramientas/EmpoderamientoFamiliarHerramienta.jsx')),
  AUTOESTIMA: lazy(() => import('../herramientas/AutoestimaHerramienta.jsx')),
  HONHUM: lazy(() => import('../herramientas/HonestidadHumildadHerramienta.jsx')),
  RESIND: lazy(() => import('../herramientas/ResilienciaIndividualHerramienta.jsx')),
  FORTVIRT: lazy(() => import('../herramientas/FortalezasPorVirtudHerramienta.jsx')),
  RIASECHIB: lazy(() => import('../herramientas/InteresesTipologicosHerramienta.jsx')),
  INTERES: lazy(() => import('../herramientas/InteresesPreferenciasVitalesHerramienta.jsx')),
  APTITUD: lazy(() => import('../herramientas/AptitudesHabilidadesHerramienta.jsx')),
  CRIANZA: lazy(() => import('../herramientas/PracticasCrianzaHerramienta.jsx')),
  CVIDAHIB: lazy(() => import('../herramientas/CalidadVidaDominiosHerramienta.jsx')),
  EDU: lazy(() => import('../herramientas/ExploracionEducativaHerramienta.jsx')),
  OCUP: lazy(() => import('../herramientas/ExploracionOcupacionalHerramienta.jsx')),
  SOCIOECO: lazy(() => import('../herramientas/CaracterizacionSocioeconomicaHerramienta.jsx')),
  CULTURAL: lazy(() => import('../herramientas/ExploracionCulturalHerramienta.jsx')),
  TERRITORIO: lazy(() => import('../herramientas/ExploracionTerritorialHerramienta.jsx')),
  PROYVIDA: lazy(() => import('../herramientas/ProyectoDeVidaHerramienta.jsx')),
};
