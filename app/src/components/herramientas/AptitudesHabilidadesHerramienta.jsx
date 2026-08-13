import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { APTITUDES_HABILIDADES } from '../../data/instrumentos/aptitudesHabilidades.js';

export default function AptitudesHabilidadesHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={APTITUDES_HABILIDADES}
      eyebrow="Módulo de Perfilamiento · Intereses y Potencial"
      metaTitle="Aptitudes y Habilidades"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
