// Tarjeta de sección estándar para los formularios (título + ayuda + contenido).
export default function Section({ title, hint, children }) {
  return (
    <div className="section">
      {title && <h2>{title}</h2>}
      {hint && <div className="hint">{hint}</div>}
      {children}
    </div>
  );
}
