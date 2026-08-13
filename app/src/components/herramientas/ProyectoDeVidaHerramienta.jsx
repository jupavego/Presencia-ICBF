import CategoricoHerramienta from './CategoricoHerramienta.jsx';
import { PROYECTO_DE_VIDA } from '../../data/instrumentos/proyectoDeVida.js';

export default function ProyectoDeVidaHerramienta() {
  return (
    <CategoricoHerramienta
      definicion={PROYECTO_DE_VIDA}
      eyebrow="Módulo de Perfilamiento · Proyecto de Vida"
      metaTitle="Proyecto de Vida"
      metaSub="Diseño propio · Motor cualitativo"
    />
  );
}
