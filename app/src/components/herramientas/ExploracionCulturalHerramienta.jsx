import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { EXPLORACION_CULTURAL } from '../../data/instrumentos/exploracionCultural.js';

export default function ExploracionCulturalHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={EXPLORACION_CULTURAL}
      eyebrow="Módulo de Perfilamiento · Cultural"
      metaTitle="Exploración Cultural"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
