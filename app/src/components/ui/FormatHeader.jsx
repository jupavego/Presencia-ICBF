// Encabezado de portada de cada formato (título, descripción y ficha técnica).
export default function FormatHeader({ eyebrow, title, description, metaTitle, metaSub }) {
  return (
    <div className="fhero">
      <div>
        <div className="feyebrow2">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {metaTitle && (
        <div className="fmeta">
          {metaTitle}
          {metaSub && <span>{metaSub}</span>}
        </div>
      )}
    </div>
  );
}
