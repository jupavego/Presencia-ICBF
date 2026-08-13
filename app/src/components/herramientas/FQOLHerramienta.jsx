import { useMemo, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import Choice from '../ui/Choice.jsx';
import Callout from '../ui/Callout.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import { FQOL } from '../../data/instrumentos/fqol.js';
import { leerInstrumentoMultiescala } from '../../lib/motorInstrumento.js';

const ETIQUETA_POR_VALOR = Object.fromEntries(FQOL.opciones.map((o) => [o.valor, o.etiqueta]));
const VALOR_POR_ETIQUETA = Object.fromEntries(FQOL.opciones.map((o) => [o.etiqueta, o.valor]));
const ETIQUETAS = FQOL.opciones.map((o) => o.etiqueta);

// Quinta herramienta funcional del módulo. Primera con una subescala
// condicional: "Apoyo por discapacidad" solo se evalúa (y solo cuenta para
// el perfil) si la familia confirma tener un integrante con discapacidad —
// de lo contrario se excluye por completo del cálculo, para no generar un
// falso patrón de insatisfacción por una pregunta que no aplica.
export default function FQOLHerramienta() {
  const [aplicaDiscapacidad, setAplicaDiscapacidad] = useState(null); // null | true | false
  const [respuestas, setRespuestas] = useState({});

  const subescalasActivas = useMemo(
    () => FQOL.subescalas.filter((s) => !s.condicional || aplicaDiscapacidad === true),
    [aplicaDiscapacidad],
  );
  const itemsActivos = useMemo(() => subescalasActivas.flatMap((s) => s.items), [subescalasActivas]);
  const definicionActiva = useMemo(() => ({ ...FQOL, subescalas: subescalasActivas }), [subescalasActivas]);

  const listoParaResponder = aplicaDiscapacidad !== null;
  const completo = listoParaResponder && itemsActivos.every((it) => respuestas[it.id] !== undefined);
  const resultado = completo ? leerInstrumentoMultiescala(definicionActiva, respuestas) : null;

  function responder(itemId, etiqueta) {
    setRespuestas((r) => ({ ...r, [itemId]: VALOR_POR_ETIQUETA[etiqueta] }));
  }

  return (
    <div>
      <FormatHeader
        eyebrow="Módulo de Perfilamiento · Familia"
        title={FQOL.nombre}
        description={FQOL.descripcion}
        metaTitle="FQOL Scale"
        metaSub="Beach Center on Disability"
      />

      <Section title="Antes de empezar" hint="La subescala de Apoyo por discapacidad solo aplica si corresponde a la situación de la familia.">
        <Choice
          label="¿Algún integrante de la familia tiene una condición de discapacidad?"
          name="aplica_discapacidad"
          options={['Sí', 'No']}
          value={aplicaDiscapacidad === null ? null : aplicaDiscapacidad ? 'Sí' : 'No'}
          onChange={(v) => setAplicaDiscapacidad(v === 'Sí')}
        />
      </Section>

      {listoParaResponder && subescalasActivas.map((sub) => (
        <Section key={sub.id} title={sub.nombre} hint="Indique qué tan satisfecho/a está con cada aspecto.">
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

      {listoParaResponder && (
        <Section title="Perfil descriptivo" hint="Se genera automáticamente a partir de las respuestas. Nunca es un diagnóstico: son patrones e hipótesis para conversar con la familia.">
          {resultado?.completo ? (
            <>
              <div className="lectura-metrics">
                {subescalasActivas.map((sub) => (
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
            <Callout>Responda las {itemsActivos.length} preguntas para generar el perfil descriptivo.</Callout>
          )}
          <Callout variant="warn">
            Esta lectura es descriptiva, no diagnóstica. El propio instrumento aclara que no debe usarse para
            determinar elegibilidad a servicios ni con fines diagnósticos. Debe interpretarse conversando con la
            familia y con el criterio profesional del Equipo de Acompañamiento.
          </Callout>
        </Section>
      )}
    </div>
  );
}
