import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { INTERESES_PREFERENCIAS_VITALES } from '../../data/instrumentos/interesesPreferenciasVitales.js';

export default function InteresesPreferenciasVitalesHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={INTERESES_PREFERENCIAS_VITALES}
      eyebrow="Módulo de Perfilamiento · Intereses y Potencial"
      metaTitle="Intereses y Preferencias Vitales"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
