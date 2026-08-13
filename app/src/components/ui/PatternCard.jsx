const NIVEL_LABEL = {
  fortaleza: 'Fortaleza',
  oportunidad: 'Oportunidad de fortalecimiento',
  profundizacion: 'Situación para profundizar',
};

// Presenta un hallazgo del motor de lectura de red: evidencia registrada,
// lectura descriptiva, preguntas para conversar con la familia y la
// oportunidad que se desprende de ahí. No es un diagnóstico.
export default function PatternCard({ patron }) {
  return (
    <div className={`pattern-card ${patron.nivel}`}>
      <div className="pattern-head">
        <span className="pattern-level">{NIVEL_LABEL[patron.nivel] || patron.nivel}</span>
        <b>{patron.titulo}</b>
      </div>
      <p>{patron.lectura}</p>
      {patron.evidencia?.length > 0 && (
        <div className="pattern-block">
          <b>Evidencia registrada</b>
          <ul>{patron.evidencia.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}
      {patron.preguntas?.length > 0 && (
        <div className="pattern-block">
          <b>Para conversar</b>
          <ul>{patron.preguntas.map((q, i) => <li key={i}>{q}</li>)}</ul>
        </div>
      )}
      {patron.oportunidad && (
        <div className="pattern-block">
          <b>Oportunidad</b>
          <p>{patron.oportunidad}</p>
        </div>
      )}
      {patron.estrategias?.length > 0 && (
        <div className="pattern-block strategy">
          <b>Estrategias a considerar</b>
          <ul>{patron.estrategias.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}
      {patron.riesgos?.length > 0 && (
        <div className="pattern-block risk">
          <b>Factores a priorizar</b>
          <ul>{patron.riesgos.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
