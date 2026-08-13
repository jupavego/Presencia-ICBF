import { useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import Choice from '../ui/Choice.jsx';
import Callout from '../ui/Callout.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import { EMPODERAMIENTO_FAMILIAR } from '../../data/instrumentos/empoderamientoFamiliar.js';
import { leerCategorias } from '../../lib/motorInstrumento.js';

// Primera herramienta funcional del módulo construida con el motor
// cualitativo (leerCategorias): 4 preguntas de respuesta cerrada
// (selección única / presencia / frecuencia), cada una con su categoría
// ya asociada — sin sumar puntajes, cruzando categorías entre sí.
export default function EmpoderamientoFamiliarHerramienta() {
  const [respuestas, setRespuestas] = useState({});

  const completo = EMPODERAMIENTO_FAMILIAR.preguntas.every((p) => respuestas[p.id] !== undefined);
  const resultado = completo ? leerCategorias(EMPODERAMIENTO_FAMILIAR, respuestas) : null;

  function responder(preguntaId, etiqueta, pregunta) {
    const opcion = pregunta.opciones.find((o) => o.etiqueta === etiqueta);
    setRespuestas((r) => ({ ...r, [preguntaId]: opcion.valor }));
  }

  return (
    <div>
      <FormatHeader
        eyebrow="Módulo de Perfilamiento · Familia"
        title={EMPODERAMIENTO_FAMILIAR.nombre}
        description={EMPODERAMIENTO_FAMILIAR.descripcion}
        metaTitle="Empoderamiento Familiar"
        metaSub="Diseño propio · Motor cualitativo"
      />

      <Section title="Preguntas" hint="Elija la opción que mejor describa a su familia.">
        {EMPODERAMIENTO_FAMILIAR.preguntas.map((pregunta) => {
          const opcionActual = respuestas[pregunta.id] !== undefined
            ? pregunta.opciones.find((o) => o.valor === respuestas[pregunta.id])?.etiqueta
            : null;
          return (
            <Choice
              key={pregunta.id}
              label={pregunta.texto}
              name={pregunta.id}
              options={pregunta.opciones.map((o) => o.etiqueta)}
              value={opcionActual}
              onChange={(etiqueta) => responder(pregunta.id, etiqueta, pregunta)}
            />
          );
        })}
      </Section>

      <Section title="Perfil descriptivo" hint="Se genera automáticamente a partir de las respuestas. Nunca es un diagnóstico: son patrones e hipótesis para conversar con la familia.">
        {resultado?.completo ? (
          <div className="pattern-list">
            {resultado.patrones.map((p) => <PatternCard key={p.codigo} patron={p} />)}
          </div>
        ) : (
          <Callout>Responda las {EMPODERAMIENTO_FAMILIAR.preguntas.length} preguntas para generar el perfil descriptivo.</Callout>
        )}
        <Callout variant="warn">
          Esta lectura es descriptiva, no diagnóstica: es un instrumento de diseño propio (híbrido), sin evidencia
          psicométrica propia. Debe interpretarse conversando con la familia y con el criterio profesional del
          Equipo de Acompañamiento.
        </Callout>
      </Section>
    </div>
  );
}
