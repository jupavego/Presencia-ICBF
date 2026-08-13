import { useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import Choice from '../ui/Choice.jsx';
import Callout from '../ui/Callout.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import { FACES20ESP } from '../../data/instrumentos/faces20esp.js';
import { leerInstrumentoMultiescala } from '../../lib/motorInstrumento.js';

const ETIQUETA_POR_VALOR = Object.fromEntries(FACES20ESP.opciones.map((o) => [o.valor, o.etiqueta]));
const VALOR_POR_ETIQUETA = Object.fromEntries(FACES20ESP.opciones.map((o) => [o.etiqueta, o.valor]));
const ETIQUETAS = FACES20ESP.opciones.map((o) => o.etiqueta);
const TODOS_LOS_ITEMS = FACES20ESP.subescalas.flatMap((s) => s.items);

// Tercera herramienta funcional del módulo: primera que usa el modelo
// curvilíneo de Olson (los extremos, no solo los puntajes bajos, son la
// lectura relevante) en vez de bandas lineales bajo/medio/alto.
export default function FACES20espHerramienta() {
  const [respuestas, setRespuestas] = useState({});

  const completo = TODOS_LOS_ITEMS.every((it) => respuestas[it.id] !== undefined);
  const resultado = completo ? leerInstrumentoMultiescala(FACES20ESP, respuestas) : null;

  function responder(itemId, etiqueta) {
    setRespuestas((r) => ({ ...r, [itemId]: VALOR_POR_ETIQUETA[etiqueta] }));
  }

  return (
    <div>
      <FormatHeader
        eyebrow="Módulo de Perfilamiento · Familia"
        title={FACES20ESP.nombre}
        description={FACES20ESP.descripcion}
        metaTitle="FACES-20esp"
        metaSub="Cohesión y adaptabilidad"
      />

      {FACES20ESP.subescalas.map((sub) => (
        <Section key={sub.id} title={sub.nombre} hint="Indique con qué frecuencia le ocurre esto en su familia.">
          {sub.items.map((item) => (
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
      ))}

      <Section title="Perfil descriptivo" hint="Se genera automáticamente a partir de las respuestas. Nunca es un diagnóstico: son patrones e hipótesis para conversar con la familia.">
        {resultado?.completo ? (
          <>
            <div className="lectura-metrics">
              {FACES20ESP.subescalas.map((sub) => (
                <div key={sub.id}>
                  <b>{resultado.puntajes[sub.id].toFixed(1)}/5</b>
                  <span>{sub.nombre}</span>
                </div>
              ))}
            </div>
            <div className="pattern-list">
              {resultado.patrones.map((p) => <PatternCard key={p.codigo} patron={p} />)}
            </div>
          </>
        ) : (
          <Callout>Responda las 20 preguntas para generar el perfil descriptivo.</Callout>
        )}
        <Callout variant="warn">
          Esta lectura es descriptiva, no diagnóstica. Se basa en el modelo circumplejo de Olson (los extremos de
          cada dimensión, no solo los puntajes bajos, son la lectura relevante). Debe interpretarse conversando con
          la familia y con el criterio profesional del Equipo de Acompañamiento.
        </Callout>
      </Section>
    </div>
  );
}
