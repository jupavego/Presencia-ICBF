import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { EXPLORACION_EDUCATIVA } from '../../data/instrumentos/exploracionEducativa.js';

export default function ExploracionEducativaHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={EXPLORACION_EDUCATIVA}
      eyebrow="Módulo de Perfilamiento · Educación"
      metaTitle="Exploración Educativa"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
