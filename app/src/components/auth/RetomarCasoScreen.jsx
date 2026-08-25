import { useState } from 'react';
import { TextField } from '../ui/Field.jsx';
import Callout from '../ui/Callout.jsx';
import { useCaso } from '../../context/CasoContext.jsx';

// Overlay para que un beneficiario retome su caso desde otro dispositivo,
// o tras borrar los datos del navegador — en el mismo dispositivo no hace
// falta, `casoActivoId` ya persiste en localStorage (ver CasoContext.jsx).
// Mismo patrón visual que LoginScreen.jsx.
export default function RetomarCasoScreen({ onClose }) {
  const { retomarConCodigo } = useCaso();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const caso = await retomarConCodigo(codigo.trim());
      if (!caso) {
        setError('No se encontró ningún caso con ese código. Verifíquelo e intente de nuevo.');
        return;
      }
      onClose?.();
    } catch (err) {
      setError('No se pudo verificar el código. Intente de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="viewer" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <form onSubmit={handleSubmit} className="hero" style={{ width: 360, maxWidth: '90vw', position: 'relative' }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          style={{ position: 'absolute', top: 14, right: 14, background: 'transparent', border: 0, color: 'inherit', fontSize: 18, cursor: 'pointer', opacity: 0.75 }}
        >
          ✕
        </button>
        <h1>Retomar caso</h1>
        <p>Ingrese el código de acceso de 8 caracteres que se le entregó al registrar su petición.</p>
        <div style={{ marginTop: 16 }}>
          <TextField
            label="Código de acceso"
            name="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="Ej. A1B2C3D4"
            maxLength={8}
            required
            autoFocus
          />
        </div>
        {error && (
          <div style={{ marginTop: 12 }}>
            <Callout variant="warn">{error}</Callout>
          </div>
        )}
        <button type="submit" className="fbtn2 primary" style={{ marginTop: 16, width: '100%' }} disabled={enviando}>
          {enviando ? 'Verificando…' : 'Retomar caso'}
        </button>
      </form>
    </div>
  );
}
