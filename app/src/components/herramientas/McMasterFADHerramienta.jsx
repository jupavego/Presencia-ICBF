import { useMemo, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import Choice from '../ui/Choice.jsx';
import Callout from '../ui/Callout.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import { MCMASTER_FAD } from '../../data/instrumentos/mcmasterFad.js';
import { leerInstrumentoMultiescala } from '../../lib/motorInstrumento.js';
import { useRegistrarEnPerfilSesion } from '../../context/PerfilSesionContext.jsx';

const ETIQUETA_POR_VALOR = Object.fromEntries(MCMASTER_FAD.opciones.map((o) => [o.valor, o.etiqueta]));
const VALOR_POR_ETIQUETA = Object.fromEntries(MCMASTER_FAD.opciones.map((o) => [o.etiqueta, o.valor]));
const ETIQUETAS = MCMASTER_FAD.opciones.map((o) => o.etiqueta);
const TODOS_LOS_ITEMS = MCMASTER_FAD.subescalas.flatMap((s) => s.items);

// Sexta herramienta funcional del módulo, y la más grande (60 ítems, 7
// subescalas). Primera que usa ítems invertidos de verdad — motivó la
// corrección de `calcularPuntaje` en motorInstrumento.js para soportar
// escalas que no empiezan en 0 (esta es Likert 1-4).
export default function McMasterFADHerramienta() {
  const [respuestas, setRespuestas] = useState({});

  const completo = TODOS_LOS_ITEMS.every((it) => respuestas[it.id] !== undefined);
  const resultado = useMemo(() => (completo ? leerInstrumentoMultiescala(MCMASTER_FAD, respuestas) : null), [completo, respuestas]);
  useRegistrarEnPerfilSesion(MCMASTER_FAD.id, resultado);

  function responder(itemId, etiqueta) {
    setRespuestas((r) => ({ ...r, [itemId]: VALOR_POR_ETIQUETA[etiqueta] }));
  }

  return (
    <div>
      <FormatHeader
        eyebrow="Módulo de Perfilamiento · Familia"
        title={MCMASTER_FAD.nombre}
        description={MCMASTER_FAD.descripcion}
        metaTitle="McMaster FAD"
        metaSub="7 áreas de funcionamiento familiar"
      />

      {MCMASTER_FAD.subescalas.map((sub) => (
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
              {MCMASTER_FAD.subescalas.map((sub) => (
                <div key={sub.id}>
                  <b>{resultado.puntajes[sub.id].toFixed(2)}/4</b>
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
          Esta lectura es descriptiva, no diagnóstica. En este instrumento un puntaje más alto indica más
          dificultad percibida; los niveles usados (saludable/cierta dificultad/dificultad marcada) son un corte
          descriptivo propio del equipo, no un punto de corte clínico oficial. Debe interpretarse conversando con
          la familia y con el criterio profesional del Equipo de Acompañamiento.
        </Callout>
      </Section>
    </div>
  );
}
