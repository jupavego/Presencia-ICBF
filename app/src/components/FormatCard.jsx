export default function FormatCard({ formato, onOpen }) {
  const disponible = !!formato.componentKey;
  return (
    <div className="fcard">
      <div className="fcard-top">
        <span className="fcode">{formato.codigo}</span>
        <span className={`status ${formato.estado}`}>{formato.estado}</span>
      </div>
      <p className="fname">{formato.nombre}</p>
      <p className="fdesc">{formato.desc}</p>
      {formato.nota && <div className="fnote">{formato.nota}</div>}
      {disponible ? (
        <button type="button" className="fbtn" onClick={() => onOpen(formato)}>Abrir formato →</button>
      ) : (
        <button type="button" className="fbtn" disabled>Aún no digitalizado</button>
      )}
    </div>
  );
}
