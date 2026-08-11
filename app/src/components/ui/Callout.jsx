// Aviso o nota destacada dentro de un formulario. variant: 'info' | 'warn'
export default function Callout({ variant = 'info', children }) {
  return <div className={`callout ${variant}`}>{children}</div>;
}
