import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { INTERESES_TIPOLOGICOS } from '../../data/instrumentos/interesesTipologicos.js';

export default function InteresesTipologicosHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={INTERESES_TIPOLOGICOS}
      eyebrow="Módulo de Perfilamiento · Intereses y Potencial"
      metaTitle="Intereses Tipológico"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
