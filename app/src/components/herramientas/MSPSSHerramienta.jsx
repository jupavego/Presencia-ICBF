import { useMemo, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import Choice from '../ui/Choice.jsx';
import Callout from '../ui/Callout.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import { MSPSS } from '../../data/instrumentos/mspss.js';
import { leerInstrumentoMultiescala } from '../../lib/motorInstrumento.js';
import { useRegistrarEnPerfilSesion } from '../../context/PerfilSesionContext.jsx';

const ETIQUETA_POR_VALOR = Object.fromEntries(MSPSS.opciones.map((o) => [o.valor, o.etiqueta]));
const VALOR_POR_ETIQUETA = Object.fromEntries(MSPSS.opciones.map((o) => [o.etiqueta, o.valor]));
const ETIQUETAS = MSPSS.opciones.map((o) => o.etiqueta);
const TODOS_LOS_ITEMS = MSPSS.subescalas.flatMap((s) => s.items);

// Segunda herramienta funcional del módulo: prueba la variante
// multiescala del motor genérico (3 subescalas independientes, en vez de
// una sola dimensión como el WHO-5).
export default function MSPSSHerramienta() {
  const [respuestas, setRespuestas] = useState({});

  const completo = TODOS_LOS_ITEMS.every((it) => respuestas[it.id] !== undefined);
  const resultado = useMemo(() => (completo ? leerInstrumentoMultiescala(MSPSS, respuestas) : null), [completo, respuestas]);
  useRegistrarEnPerfilSesion(MSPSS.id, resultado);

  function responder(itemId, etiqueta) {
    setRespuestas((r) => ({ ...r, [itemId]: VALOR_POR_ETIQUETA[etiqueta] }));
  }

  return (
    <div>
      <FormatHeader
        eyebrow="Módulo de Perfilamiento · Relaciones / Redes"
        title={MSPSS.nombre}
        description={MSPSS.descripcion}
        metaTitle="MSPSS"
        metaSub="Apoyo social percibido"
      />

      {MSPSS.subescalas.map((sub) => (
        <Section key={sub.id} title={sub.nombre} hint="Indique qué tan de acuerdo está con cada afirmación.">
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
              {MSPSS.subescalas.map((sub) => (
                <div key={sub.id}>
                  <b>{resultado.puntajes[sub.id].toFixed(1)}/7</b>
                  <span>{sub.nombre}</span>
                </div>
              ))}
            </div>
            <div className="pattern-list">
              {resultado.patrones.map((p) => <PatternCard key={p.codigo} patron={p} />)}
            </div>
          </>
        ) : (
          <Callout>Responda las 12 preguntas para generar el perfil descriptivo.</Callout>
        )}
        <Callout variant="warn">
          Esta lectura es descriptiva, no diagnóstica. Los rangos usados (bajo/moderado/alto) son orientativos —
          el MSPSS no tiene normas poblacionales oficiales publicadas. Debe interpretarse conversando con la
          persona y con el criterio profesional del Equipo de Acompañamiento.
        </Callout>
      </Section>
    </div>
  );
}
