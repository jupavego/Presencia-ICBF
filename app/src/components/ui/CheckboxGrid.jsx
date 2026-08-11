import Tooltip from './Tooltip.jsx';

// Selección múltiple presentada en grilla de casillas (reemplaza listas de checkboxes repetidas).
// `tip` (opcional) agrega un ícono de ayuda junto a la etiqueta del grupo.
export default function CheckboxGrid({ label, tip, options, selected, onChange, cols }) {
  function toggle(opt) {
    onChange(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt]);
  }
  return (
    <div>
      {label && (
        <label style={{ marginBottom: 8 }}>
          {label}
          {tip && <Tooltip text={tip}><span className="tip-ico">?</span></Tooltip>}
        </label>
      )}
      <div className={`check-grid${cols ? ' cols-' + cols : ''}`}>
        {options.map((opt) => (
          <label key={opt}>
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
