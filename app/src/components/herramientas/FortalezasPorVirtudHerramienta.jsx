import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { FORTALEZAS_POR_VIRTUD } from '../../data/instrumentos/fortalezasPorVirtud.js';

export default function FortalezasPorVirtudHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={FORTALEZAS_POR_VIRTUD}
      eyebrow="Módulo de Perfilamiento · Intereses y Potencial"
      metaTitle="Fortalezas por Virtud"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
