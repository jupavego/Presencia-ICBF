import { useMemo, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import Choice from '../ui/Choice.jsx';
import Callout from '../ui/Callout.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import { FRAS_HIBRIDO } from '../../data/instrumentos/frasHibrido.js';
import { leerInstrumentoMultiescala } from '../../lib/motorInstrumento.js';
import { useRegistrarEnPerfilSesion } from '../../context/PerfilSesionContext.jsx';

const ETIQUETA_POR_VALOR = Object.fromEntries(FRAS_HIBRIDO.opciones.map((o) => [o.valor, o.etiqueta]));
const VALOR_POR_ETIQUETA = Object.fromEntries(FRAS_HIBRIDO.opciones.map((o) => [o.etiqueta, o.valor]));
const ETIQUETAS = FRAS_HIBRIDO.opciones.map((o) => o.etiqueta);
const TODOS_LOS_ITEMS = FRAS_HIBRIDO.subescalas.flatMap((s) => s.items);

// Séptima herramienta funcional del módulo. Primer híbrido implementado
// como instrumento cuantitativo (no de licencia bloqueada, sino de fuente
// incompleta): conserva las 6 dimensiones del modelo de Walsh, con
// preguntas de diseño propio en vez de los ítems reales del FRAS, que no
// están disponibles completos en la fuente revisada.
export default function FRASHibridoHerramienta() {
  const [respuestas, setRespuestas] = useState({});

  const completo = TODOS_LOS_ITEMS.every((it) => respuestas[it.id] !== undefined);
  const resultado = useMemo(() => (completo ? leerInstrumentoMultiescala(FRAS_HIBRIDO, respuestas) : null), [completo, respuestas]);
  useRegistrarEnPerfilSesion(FRAS_HIBRIDO.id, resultado);

  function responder(itemId, etiqueta) {
    setRespuestas((r) => ({ ...r, [itemId]: VALOR_POR_ETIQUETA[etiqueta] }));
  }

  return (
    <div>
      <FormatHeader
        eyebrow="Módulo de Perfilamiento · Familia"
        title={FRAS_HIBRIDO.nombre}
        description={FRAS_HIBRIDO.descripcion}
        metaTitle="FRAS (híbrido)"
        metaSub="Modelo de resiliencia familiar de Walsh"
      />

      <Callout>
        Estas preguntas son de diseño propio del equipo — no son los ítems del FRAS original, cuyo paper de
        adaptación colombiana no reproduce el cuestionario completo. Se conserva el modelo teórico de 6
        dimensiones de Walsh, verificado en el mapa teórico del proyecto.
      </Callout>

      {FRAS_HIBRIDO.subescalas.map((sub) => (
        <Section key={sub.id} title={sub.nombre} hint="Indique con qué frecuencia le ocurre esto a su familia.">
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
              {FRAS_HIBRIDO.subescalas.map((sub) => (
                <div key={sub.id}>
                  <b>{resultado.puntajes[sub.id].toFixed(1)}/3</b>
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
          Esta lectura es descriptiva, no diagnóstica: es un instrumento de diseño propio (híbrido), sin evidencia
          psicométrica propia. Debe interpretarse conversando con la familia y con el criterio profesional del
          Equipo de Acompañamiento.
        </Callout>
      </Section>
    </div>
  );
}
