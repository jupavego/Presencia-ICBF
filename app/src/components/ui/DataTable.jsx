import Tooltip from './Tooltip.jsx';

// Tabla dinámica genérica (agregar/eliminar filas) usada por los formatos
// F1 (vínculos), F6 (compromisos), F8 (cronogramas) y F10 (inversión).
//
// columns: [{ key, label, tip?, type: 'text'|'date'|'time'|'number'|'select'|'checkboxes', options?, placeholder?, width? }]
// rows: array de objetos { [key]: value }  (con type 'checkboxes', value es un array de strings)
// `tip` (opcional) agrega un ícono de ayuda junto al encabezado de la columna.

export default function DataTable({ columns, rows, onChange, newRow, minRows = 1 }) {
  function updateCell(rowIndex, key, value) {
    onChange(rows.map((r, i) => (i === rowIndex ? { ...r, [key]: value } : r)));
  }
  function addRow() {
    onChange([...rows, typeof newRow === 'function' ? newRow(rows.length) : { ...newRow }]);
  }
  function removeRow(rowIndex) {
    if (rows.length <= minRows) {
      alert(`Debe mantener al menos ${minRows} fila${minRows === 1 ? '' : 's'}.`);
      return;
    }
    onChange(rows.filter((_, i) => i !== rowIndex));
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>
                  {col.label}
                  {col.tip && <Tooltip text={col.tip}><span className="tip-ico">?</span></Tooltip>}
                </th>
              ))}
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.type === 'select' ? (
                      <select value={row[col.key] ?? ''} onChange={(e) => updateCell(ri, col.key, e.target.value)}>
                        {col.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : col.type === 'checkboxes' ? (
                      <div className="cell-checkboxes">
                        {col.options.map((opt) => {
                          const selected = Array.isArray(row[col.key]) ? row[col.key] : [];
                          const checked = selected.includes(opt);
                          return (
                            <label key={opt} className={checked ? 'chip checked' : 'chip'}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => updateCell(ri, col.key, checked ? selected.filter((o) => o !== opt) : [...selected, opt])}
                              />
                              {opt}
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        type={col.type || 'text'}
                        placeholder={col.placeholder}
                        value={row[col.key] ?? ''}
                        onChange={(e) => updateCell(ri, col.key, e.target.value)}
                        style={col.width ? { width: col.width } : undefined}
                      />
                    )}
                  </td>
                ))}
                <td><button type="button" className="remove-row" onClick={() => removeRow(ri)}>×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn-add" onClick={addRow}>＋ Agregar fila</button>
    </>
  );
}
