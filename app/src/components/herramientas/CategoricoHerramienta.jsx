import { Fragment, useMemo, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import Choice from '../ui/Choice.jsx';
import CheckboxGrid from '../ui/CheckboxGrid.jsx';
import { TextField, TextAreaField } from '../ui/Field.jsx';
import Callout from '../ui/Callout.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import { leerCategorias } from '../../lib/motorInstrumento.js';
import { useRegistrarEnPerfilSesion } from '../../context/PerfilSesionContext.jsx';

// Formulario genérico para cualquier herramienta Tipo B (motor cualitativo,
// leerCategorias). Cada herramienta categórica (Autoestima, Fortalezas por
// virtud, Educación, etc.) es un envoltorio delgado alrededor de este
// componente, pasando solo su `definicion` — evita repetir el mismo
// formulario 13 veces. Soporta los 5 tipos de pregunta parametrizados en
// docs/matriz-variables-indicadores.md: presencia, frecuencia,
// seleccion_unica (los 3 con Choice), checklist (CheckboxGrid) y numerico
// (Field).
export default function CategoricoHerramienta({ definicion, eyebrow, metaTitle, metaSub }) {
  const [respuestas, setRespuestas] = useState({});

  const completo = definicion.preguntas.every((p) => {
    const v = respuestas[p.id];
    if (p.tipo === 'checklist') return Array.isArray(v) && v.length > 0;
    return v !== undefined && v !== null && v !== '';
  });
  const resultado = useMemo(() => (completo ? leerCategorias(definicion, respuestas) : null), [completo, respuestas, definicion]);
  useRegistrarEnPerfilSesion(definicion.id, resultado);

  function responderUnica(pregunta, etiqueta) {
    const opcion = pregunta.opciones.find((o) => o.etiqueta === etiqueta);
    setRespuestas((r) => ({ ...r, [pregunta.id]: opcion.valor }));
  }

  function responderChecklist(pregunta, etiquetasSeleccionadas) {
    const valores = etiquetasSeleccionadas
      .map((etq) => pregunta.opciones.find((o) => o.etiqueta === etq)?.valor)
      .filter((v) => v !== undefined);
    setRespuestas((r) => ({ ...r, [pregunta.id]: valores }));
  }

  function responderNumerico(pregunta, valor) {
    const num = valor === '' ? undefined : Number(valor);
    setRespuestas((r) => ({ ...r, [pregunta.id]: num }));
  }

  function responderNota(pregunta, texto) {
    setRespuestas((r) => ({ ...r, [`${pregunta.id}_nota`]: texto }));
  }

  function notaAbierta(pregunta) {
    if (!pregunta.notaAbierta) return null;
    return (
      <TextAreaField
        key={`${pregunta.id}_nota`}
        label={pregunta.notaPlaceholder || 'Detalle (opcional)'}
        tip="Registro cualitativo opcional: no cambia el patrón calculado, queda como nota para la conversación."
        value={respuestas[`${pregunta.id}_nota`] || ''}
        onChange={(e) => responderNota(pregunta, e.target.value)}
      />
    );
  }

  return (
    <div>
      <FormatHeader
        eyebrow={eyebrow}
        title={definicion.nombre}
        description={definicion.descripcion}
        metaTitle={metaTitle}
        metaSub={metaSub}
      />

      <Section title="Preguntas">
        {definicion.preguntas.map((pregunta) => {
          const aviso = pregunta.avisoPrevio && (
            <Callout key={`${pregunta.id}_aviso`} variant="warn">{pregunta.avisoPrevio}</Callout>
          );
          if (pregunta.tipo === 'checklist') {
            const seleccionadas = (respuestas[pregunta.id] || [])
              .map((val) => pregunta.opciones.find((o) => o.valor === val)?.etiqueta)
              .filter(Boolean);
            return (
              <Fragment key={pregunta.id}>
                {aviso}
                <CheckboxGrid
                  label={pregunta.texto}
                  options={pregunta.opciones.map((o) => o.etiqueta)}
                  selected={seleccionadas}
                  onChange={(etqs) => responderChecklist(pregunta, etqs)}
                />
                {notaAbierta(pregunta)}
              </Fragment>
            );
          }
          if (pregunta.tipo === 'numerico') {
            return (
              <Fragment key={pregunta.id}>
                {aviso}
                <TextField
                  label={pregunta.texto}
                  type="number"
                  min="0"
                  value={respuestas[pregunta.id] ?? ''}
                  onChange={(e) => responderNumerico(pregunta, e.target.value)}
                />
                {notaAbierta(pregunta)}
              </Fragment>
            );
          }
          const etiquetaActual = respuestas[pregunta.id] !== undefined
            ? pregunta.opciones.find((o) => o.valor === respuestas[pregunta.id])?.etiqueta
            : null;
          return (
            <Fragment key={pregunta.id}>
              {aviso}
              <Choice
                label={pregunta.texto}
                name={pregunta.id}
                options={pregunta.opciones.map((o) => o.etiqueta)}
                value={etiquetaActual}
                onChange={(etiqueta) => responderUnica(pregunta, etiqueta)}
              />
              {notaAbierta(pregunta)}
            </Fragment>
          );
        })}
      </Section>

      <Section title="Perfil descriptivo" hint="Se genera automáticamente a partir de las respuestas. Nunca es un diagnóstico: son patrones e hipótesis para conversar con la persona.">
        {resultado?.completo ? (
          <div className="pattern-list">
            {resultado.patrones.map((p) => <PatternCard key={p.codigo} patron={p} />)}
          </div>
        ) : (
          <Callout>Responda las {definicion.preguntas.length} preguntas para generar el perfil descriptivo.</Callout>
        )}
        {resultado?.notas && Object.keys(resultado.notas).length > 0 && (
          <Callout>
            <b>Notas registradas</b>
            <ul>
              {Object.entries(resultado.notas).map(([id, texto]) => {
                const pregunta = definicion.preguntas.find((p) => p.id === id);
                return <li key={id}>{pregunta?.texto}: {texto}</li>;
              })}
            </ul>
          </Callout>
        )}
        <Callout variant="warn">
          Esta lectura es descriptiva, no diagnóstica: es un instrumento de diseño propio (híbrido o categoría de
          exploración), sin evidencia psicométrica propia. Debe interpretarse conversando con la persona o
          familia y con el criterio profesional del Equipo de Acompañamiento.
        </Callout>
      </Section>
    </div>
  );
}
