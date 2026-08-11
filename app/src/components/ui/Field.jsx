import Tooltip from './Tooltip.jsx';

// Campos de formulario reutilizables por todos los formatos.
// `span` acepta las clases de grilla del sistema de diseño: field | wide | full | col-3 | col-4 | col-6 | col-12
// `tip` (opcional) agrega un ícono de ayuda junto a la etiqueta, con
// orientación pedagógica sobre cómo o por qué se solicita ese dato.

function LabelWithTip({ label, tip }) {
  return (
    <label>
      {label}
      {tip && <Tooltip text={tip}><span className="tip-ico">?</span></Tooltip>}
    </label>
  );
}

export function TextField({ label, tip, span = 'field', ...props }) {
  return (
    <div className={span}>
      <LabelWithTip label={label} tip={tip} />
      <input {...props} />
    </div>
  );
}

export function TextAreaField({ label, tip, span = 'full', ...props }) {
  return (
    <div className={span}>
      <LabelWithTip label={label} tip={tip} />
      <textarea {...props} />
    </div>
  );
}

export function SelectField({ label, tip, span = 'field', options, placeholder = 'Seleccione...', ...props }) {
  return (
    <div className={span}>
      <LabelWithTip label={label} tip={tip} />
      <select {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>
    </div>
  );
}
