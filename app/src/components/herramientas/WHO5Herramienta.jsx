import { useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import Choice from '../ui/Choice.jsx';
import Callout from '../ui/Callout.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import { WHO5 } from '../../data/instrumentos/who5.js';
import { leerInstrumento } from '../../lib/motorInstrumento.js';

const ETIQUETA_POR_VALOR = Object.fromEntries(WHO5.opciones.map((o) => [o.valor, o.etiqueta]));
const VALOR_POR_ETIQUETA = Object.fromEntries(WHO5.opciones.map((o) => [o.etiqueta, o.valor]));
const ETIQUETAS = WHO5.opciones.map((o) => o.etiqueta);

// Primera herramienta funcional del módulo de perfilamiento, de punta a
// punta: captura respuestas, calcula el puntaje con el motor genérico y
// muestra el perfil descriptivo resultante. Sirve de prueba de concepto
// para el resto de instrumentos documentados en
// docs/reglas-puntuacion-interpretacion.md antes de digitalizarlos todos.
export default function WHO5Herramienta() {
  const [respuestas, setRespuestas] = useState({});

  const completo = WHO5.items.every((it) => respuestas[it.id] !== undefined);
  const resultado = completo ? leerInstrumento(WHO5, respuestas) : null;

  function responder(itemId, etiqueta) {
    setRespuestas((r) => ({ ...r, [itemId]: VALOR_POR_ETIQUETA[etiqueta] }));
  }

  return (
    <div>
      <FormatHeader
        eyebrow="Módulo de Perfilamiento · Bienestar"
        title={WHO5.nombre}
        description={WHO5.descripcion}
        metaTitle="WHO-5"
        metaSub="Bienestar subjetivo"
      />

      <Section title="Preguntas" hint="Pensando en las últimas 2 semanas, indique con qué frecuencia se ha sentido así.">
        {WHO5.items.map((item) => (
          <Choice
            key={item.id}
            label={item.texto}
            name={item.id}
            options={ETIQUETAS}
            value={respuestas[item.id] !== undefined ? ETIQUETA_POR_VALOR[respuestas[item.id]] : null}
            onChange={(etiqueta) => responder(item.id, etiqueta)}
          />
        ))}
      </Section>

      <Section title="Perfil descriptivo" hint="Se genera automáticamente a partir de las respuestas. Nunca es un diagnóstico: son patrones e hipótesis para conversar con la persona.">
        {resultado?.completo ? (
          <>
            <div className="lectura-perfil">
              <div>
                <b>Puntaje total: {resultado.puntaje.toFixed(0)}/100</b>
                <span>Suma de los 5 ítems × 4, según la fórmula oficial del WHO-5</span>
              </div>
            </div>
            <div className="pattern-list">
              {resultado.patrones.map((p) => <PatternCard key={p.codigo} patron={p} />)}
            </div>
          </>
        ) : (
          <Callout>Responda las 5 preguntas para generar el perfil descriptivo.</Callout>
        )}
        <Callout variant="warn">
          Esta lectura es descriptiva, no diagnóstica: el WHO-5 es un instrumento de screening. Debe interpretarse conversando con la persona y con el criterio profesional del Equipo de Acompañamiento.
        </Callout>
      </Section>
    </div>
  );
}
