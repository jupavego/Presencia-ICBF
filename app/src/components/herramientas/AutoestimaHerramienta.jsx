import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { AUTOESTIMA } from '../../data/instrumentos/autoestima.js';

export default function AutoestimaHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={AUTOESTIMA}
      eyebrow="Módulo de Perfilamiento · Persona"
      metaTitle="Autoestima"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
