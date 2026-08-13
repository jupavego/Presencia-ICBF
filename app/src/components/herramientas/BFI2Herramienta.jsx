import { useMemo, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import Choice from '../ui/Choice.jsx';
import Callout from '../ui/Callout.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import { BFI2 } from '../../data/instrumentos/bfi2.js';
import { leerInstrumentoMultiescala } from '../../lib/motorInstrumento.js';
import { useRegistrarEnPerfilSesion } from '../../context/PerfilSesionContext.jsx';

const ETIQUETA_POR_VALOR = Object.fromEntries(BFI2.opciones.map((o) => [o.valor, o.etiqueta]));
const VALOR_POR_ETIQUETA = Object.fromEntries(BFI2.opciones.map((o) => [o.etiqueta, o.valor]));
const ETIQUETAS = BFI2.opciones.map((o) => o.etiqueta);
const TODOS_LOS_ITEMS = BFI2.subescalas.flatMap((s) => s.items);

export default function BFI2Herramienta() {
  const [respuestas, setRespuestas] = useState({});

  const completo = TODOS_LOS_ITEMS.every((it) => respuestas[it.id] !== undefined);
  const resultado = useMemo(() => (completo ? leerInstrumentoMultiescala(BFI2, respuestas) : null), [completo, respuestas]);
  useRegistrarEnPerfilSesion(BFI2.id, resultado);

  function responder(itemId, etiqueta) {
    setRespuestas((r) => ({ ...r, [itemId]: VALOR_POR_ETIQUETA[etiqueta] }));
  }

  return (
    <div>
      <FormatHeader
        eyebrow="Módulo de Perfilamiento · Persona"
        title={BFI2.nombre}
        description={BFI2.descripcion}
        metaTitle="BFI-2"
        metaSub="Cinco Grandes"
      />

      {BFI2.subescalas.map((sub) => (
        <Section key={sub.id} title={sub.nombre} hint="Indique en qué medida cada afirmación describe a la persona (1 = muy en desacuerdo, 5 = muy de acuerdo).">
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

      <Section title="Perfil descriptivo" hint="Se genera automáticamente a partir de las respuestas. Nunca es un diagnóstico: son patrones e hipótesis para conversar con la persona.">
        {resultado?.completo ? (
          <>
            <div className="lectura-metrics">
              {BFI2.subescalas.map((sub) => (
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
          <Callout>Responda las 60 preguntas para generar el perfil descriptivo.</Callout>
        )}
        <Callout variant="warn">
          Esta lectura es descriptiva, no diagnóstica. Ningún dominio del modelo de los Cinco Grandes es "bueno" o
          "malo" por sí mismo — debe interpretarse conversando con la persona y con el criterio profesional del
          Equipo de Acompañamiento.
        </Callout>
      </Section>
    </div>
  );
}
