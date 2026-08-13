import { useMemo, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import Choice from '../ui/Choice.jsx';
import Callout from '../ui/Callout.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import { FRAS_REAL } from '../../data/instrumentos/frasReal.js';
import { leerInstrumentoMultiescala } from '../../lib/motorInstrumento.js';
import { useRegistrarEnPerfilSesion } from '../../context/PerfilSesionContext.jsx';

const ETIQUETA_POR_VALOR = Object.fromEntries(FRAS_REAL.opciones.map((o) => [o.valor, o.etiqueta]));
const VALOR_POR_ETIQUETA = Object.fromEntries(FRAS_REAL.opciones.map((o) => [o.etiqueta, o.valor]));
const ETIQUETAS = FRAS_REAL.opciones.map((o) => o.etiqueta);
const TODOS_LOS_ITEMS = FRAS_REAL.subescalas.flatMap((s) => s.items);

export default function FRASRealHerramienta() {
  const [respuestas, setRespuestas] = useState({});

  const completo = TODOS_LOS_ITEMS.every((it) => respuestas[it.id] !== undefined);
  const resultado = useMemo(() => (completo ? leerInstrumentoMultiescala(FRAS_REAL, respuestas) : null), [completo, respuestas]);
  useRegistrarEnPerfilSesion(FRAS_REAL.id, resultado);

  function responder(itemId, etiqueta) {
    setRespuestas((r) => ({ ...r, [itemId]: VALOR_POR_ETIQUETA[etiqueta] }));
  }

  return (
    <div>
      <FormatHeader
        eyebrow="Módulo de Perfilamiento · Familia"
        title={FRAS_REAL.nombre}
        description={FRAS_REAL.descripcion}
        metaTitle="FRAS-54"
        metaSub="Sixbey (2005) · Traducción propia"
      />

      <Callout>
        Los 54 ítems son una traducción propia del original en inglés (Sixbey, 2005), no una adaptación validada al
        español. Se conserva el contenido real del instrumento — a diferencia de la versión híbrida disponible en
        esta misma esfera, que usa preguntas de diseño propio inspiradas en el mismo modelo.
      </Callout>

      {FRAS_REAL.subescalas.map((sub) => (
        <Section key={sub.id} title={sub.nombre} hint="Indique qué tan de acuerdo está con cada afirmación, pensando en cómo es su familia.">
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
              {FRAS_REAL.subescalas.map((sub) => (
                <div key={sub.id}>
                  <b>{resultado.puntajes[sub.id].toFixed(1)}/4</b>
                  <span>{sub.nombre}</span>
                </div>
              ))}
            </div>
            <div className="pattern-list">
              {resultado.patrones.map((p) => <PatternCard key={p.codigo} patron={p} />)}
            </div>
          </>
        ) : (
          <Callout>Responda las {TODOS_LOS_ITEMS.length} preguntas para generar el perfil descriptivo.</Callout>
        )}
        <Callout variant="warn">
          Esta lectura es descriptiva, no diagnóstica. Ningún factor del FRAS-54 es "bueno" o "malo" por sí mismo —
          debe interpretarse conversando con la familia y con el criterio profesional del Equipo de Acompañamiento.
        </Callout>
      </Section>
    </div>
  );
}
