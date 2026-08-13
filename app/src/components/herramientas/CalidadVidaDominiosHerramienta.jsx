import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { CALIDAD_VIDA_DOMINIOS } from '../../data/instrumentos/calidadVidaDominios.js';

export default function CalidadVidaDominiosHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={CALIDAD_VIDA_DOMINIOS}
      eyebrow="Módulo de Perfilamiento · Bienestar"
      metaTitle="Calidad de Vida por Dominios"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
