// Tooltip accesible (hover + foco por teclado), CSS puro. `children` es el
// disparador (texto, chip, ícono); `text` es el contenido explicativo.
export default function Tooltip({ text, children, align = 'center' }) {
  return (
    <span className="tip" tabIndex={0}>
      {children}
      <span className={`tip-bubble ${align}`} role="tooltip">{text}</span>
    </span>
  );
}
