import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { EXPLORACION_TERRITORIAL } from '../../data/instrumentos/exploracionTerritorial.js';

export default function ExploracionTerritorialHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={EXPLORACION_TERRITORIAL}
      eyebrow="Módulo de Perfilamiento · Territorial y Comunitaria"
      metaTitle="Exploración Territorial"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
