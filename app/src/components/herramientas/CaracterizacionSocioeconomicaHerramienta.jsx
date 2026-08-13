import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { CARACTERIZACION_SOCIOECONOMICA } from '../../data/instrumentos/caracterizacionSocioeconomica.js';

export default function CaracterizacionSocioeconomicaHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={CARACTERIZACION_SOCIOECONOMICA}
      eyebrow="Módulo de Perfilamiento · Socioeconómica"
      metaTitle="Caracterización Socioeconómica"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
