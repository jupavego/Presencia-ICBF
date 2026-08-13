import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { HONESTIDAD_HUMILDAD } from '../../data/instrumentos/honestidadHumildad.js';

export default function HonestidadHumildadHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={HONESTIDAD_HUMILDAD}
      eyebrow="Módulo de Perfilamiento · Persona"
      metaTitle="Honestidad-Humildad"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
