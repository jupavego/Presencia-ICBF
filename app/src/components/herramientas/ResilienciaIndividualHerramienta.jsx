import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { RESILIENCIA_INDIVIDUAL } from '../../data/instrumentos/resilienciaIndividual.js';

export default function ResilienciaIndividualHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={RESILIENCIA_INDIVIDUAL}
      eyebrow="Módulo de Perfilamiento · Persona"
      metaTitle="Resiliencia Individual"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
