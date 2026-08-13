import { useState } from 'react';

// Barra de acciones al final de cada formulario (guardar borrador / enviar /
// descargar en el formato oficial). `onExport`, si se provee, agrega el
// botón de descarga y maneja su propio estado de carga y error.
export default function FormActions({ statusText, onSaveDraft, submitLabel = 'Guardar registro →', onExport, exportLabel = 'Descargar en formato oficial ⬇' }) {
  const [exportando, setExportando] = useState(false);

  async function handleExport() {
    setExportando(true);
    try {
      await onExport();
    } catch (err) {
      console.error(err);
      alert('No se pudo generar el documento oficial. Intente de nuevo.');
    } finally {
      setExportando(false);
    }
  }

  return (
    <div className="factions">
      <span className="fnote-status">{statusText}</span>
      <div>
        {onExport && (
          <button type="button" className="fbtn2 secondary" onClick={handleExport} disabled={exportando}>
            {exportando ? 'Generando…' : exportLabel}
          </button>
        )}
        <button type="button" className="fbtn2 secondary" onClick={onSaveDraft}>Guardar borrador</button>
        <button type="submit" className="fbtn2 primary">{submitLabel}</button>
      </div>
    </div>
  );
}
