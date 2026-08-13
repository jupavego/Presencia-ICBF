import Tooltip from './Tooltip.jsx';
import MoodIcon from './MoodIcon.jsx';
import { moodParaOpcion } from '../../lib/moodEscalaAcuerdo.js';

// Grupo de opciones únicas presentadas como píldoras (reemplaza radios sueltos).
// `tip` (opcional) agrega un ícono de ayuda junto a la etiqueta. Si la
// opción es de tipo acuerdo/desacuerdo, se antepone un ícono de carita en
// el mismo estilo de trazo que el resto de la interfaz (ver MoodIcon.jsx)
// — para otros tipos de respuesta (Frecuencia, Presencia, Sí/No) no se
// agrega nada.
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
            <MoodIcon mood={moodParaOpcion(opt)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
