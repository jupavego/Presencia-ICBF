import Tooltip from './Tooltip.jsx';

// Selector en tarjetas (título + descripción) para decisiones que merecen más
// contexto que una píldora de Choice/CheckboxGrid. `multiple` alterna entre
// selección única (radio, `selected` es un string) y múltiple (checkbox,
// `selected` es un arreglo). `options`: [{ value, label, desc }].
export default function OptionGrid({ label, tip, name, options, selected, onChange, multiple = false, cols = 3 }) {
  function isChecked(value) {
    return multiple ? selected.includes(value) : selected === value;
  }
  function toggle(value) {
    if (multiple) {
      onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    } else {
      onChange(value);
    }
  }
  return (
    <div>
      {label && (
        <label style={{ marginBottom: 8 }}>
          {label}
          {tip && <Tooltip text={tip}><span className="tip-ico">?</span></Tooltip>}
        </label>
      )}
      <div className={`option-grid cols-${cols}`}>
        {options.map((opt) => (
          <label key={opt.value} className={`option${isChecked(opt.value) ? ' selected' : ''}`}>
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={name}
              value={opt.value}
              checked={isChecked(opt.value)}
              onChange={() => toggle(opt.value)}
            />
            <strong>{opt.label}</strong>
            {opt.desc && <span>{opt.desc}</span>}
          </label>
        ))}
      </div>
    </div>
  );
}
