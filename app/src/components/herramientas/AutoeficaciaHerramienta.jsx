import { useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import Choice from '../ui/Choice.jsx';
import Callout from '../ui/Callout.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import { AUTOEFICACIA } from '../../data/instrumentos/autoeficacia.js';
import { leerInstrumento } from '../../lib/motorInstrumento.js';

const ETIQUETAS = AUTOEFICACIA.opciones.map((o) => o.etiqueta);

// Cuarta herramienta funcional del módulo. Unidimensional como el WHO-5,
// pero con escala de respuesta de 10 puntos en vez de 6 — confirma que el
// motor genérico no depende del tamaño de la escala.
export default function AutoeficaciaHerramienta() {
  const [respuestas, setRespuestas] = useState({});

  const completo = AUTOEFICACIA.items.every((it) => respuestas[it.id] !== undefined);
  const resultado = completo ? leerInstrumento(AUTOEFICACIA, respuestas) : null;

  function responder(itemId, etiqueta) {
    setRespuestas((r) => ({ ...r, [itemId]: Number(etiqueta) }));
  }

  return (
    <div>
      <FormatHeader
        eyebrow="Módulo de Perfilamiento · Persona"
        title={AUTOEFICACIA.nombre}
        description={AUTOEFICACIA.descripcion}
        metaTitle="Autoeficacia General"
        metaSub="1 = Totalmente en desacuerdo · 10 = Totalmente de acuerdo"
      />

      <Section title="Preguntas" hint="Indique en una escala de 1 (totalmente en desacuerdo) a 10 (totalmente de acuerdo) qué tan de acuerdo está con cada afirmación.">
        {AUTOEFICACIA.items.map((item) => (
          <Choice
            key={item.id}
            label={item.texto}
            name={item.id}
            options={ETIQUETAS}
            value={respuestas[item.id] !== undefined ? String(respuestas[item.id]) : null}
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
                <span>Suma de los 10 ítems, escala de respuesta 1-10</span>
              </div>
            </div>
            <div className="pattern-list">
              {resultado.patrones.map((p) => <PatternCard key={p.codigo} patron={p} />)}
            </div>
          </>
        ) : (
          <Callout>Responda las 10 preguntas para generar el perfil descriptivo.</Callout>
        )}
        <Callout variant="warn">
          Esta lectura es descriptiva, no diagnóstica. El instrumento no tiene puntos de corte clínicos oficiales —
          los niveles usados (baja/moderada/alta) son un corte descriptivo propio. Debe interpretarse conversando
          con la persona y con el criterio profesional del Equipo de Acompañamiento.
        </Callout>
      </Section>
    </div>
  );
}
