// Barra de acciones al final de cada formulario (guardar borrador / enviar).
export default function FormActions({ statusText, onSaveDraft, submitLabel = 'Guardar registro →' }) {
  return (
    <div className="factions">
      <span className="fnote-status">{statusText}</span>
      <div>
        <button type="button" className="fbtn2 secondary" onClick={onSaveDraft}>Guardar borrador</button>
        <button type="submit" className="fbtn2 primary">{submitLabel}</button>
      </div>
    </div>
  );
}
