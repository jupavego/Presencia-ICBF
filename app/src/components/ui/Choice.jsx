import Tooltip from './Tooltip.jsx';

// Grupo de opciones únicas presentadas como píldoras (reemplaza radios sueltos).
// `tip` (opcional) agrega un ícono de ayuda junto a la etiqueta.
export default function Choice({ label, tip, name, options, value, onChange, span = 'wide' }) {
  return (
    <div className={span}>
      {label && (
        <label>
          {label}
          {tip && <Tooltip text={tip}><span className="tip-ico">?</span></Tooltip>}
        </label>
      )}
      <div className="choice">
        {options.map((opt) => (
          <label key={opt}>
            <input type="radio" name={name} value={opt} checked={value === opt} onChange={(e) => onChange(e.target.value)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
