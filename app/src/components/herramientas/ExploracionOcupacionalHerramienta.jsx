import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { EXPLORACION_OCUPACIONAL } from '../../data/instrumentos/exploracionOcupacional.js';

export default function ExploracionOcupacionalHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={EXPLORACION_OCUPACIONAL}
      eyebrow="Módulo de Perfilamiento · Ámbito Ocupacional"
      metaTitle="Exploración Ocupacional"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
