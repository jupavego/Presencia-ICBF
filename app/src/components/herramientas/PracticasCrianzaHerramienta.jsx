import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { PRACTICAS_CRIANZA } from '../../data/instrumentos/practicasCrianza.js';

export default function PracticasCrianzaHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={PRACTICAS_CRIANZA}
      eyebrow="Módulo de Perfilamiento · Crianza y Cuidado"
      metaTitle="Prácticas de Crianza"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
