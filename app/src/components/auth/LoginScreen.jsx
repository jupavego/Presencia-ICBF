import { useState } from 'react';
import { TextField } from '../ui/Field.jsx';
import Callout from '../ui/Callout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Clave de localStorage para recordar solo el correo entre visitas — la
// contraseña NUNCA se guarda aquí. Guardar contraseñas en texto plano en
// localStorage es legible por cualquier extensión o script con acceso a
// la pestaña; para "recordar contraseña" de verdad se usa el gestor de
// contraseñas nativo del navegador, habilitado abajo con los atributos
// `name`/`autoComplete` correctos en los campos — el navegador ofrece
// guardarla tras un login exitoso, igual que en cualquier sitio.
const CLAVE_EMAIL_RECORDADO = 'presencia_email_recordado';

// Ventana de inicio de sesión: se muestra como overlay dismissible sobre
// el resto de la app (ver AppShell en App.jsx) — el sitio funciona sin
// sesión (modo invitado, sin guardado), así que este formulario ya no es
// una puerta de acceso obligatoria, solo el camino para desbloquear el
// guardado. Si `onClose` no se provee, se comporta como pantalla completa
// (compatibilidad con cualquier uso futuro fuera de un overlay).
//
// "Mantener sesión iniciada" ya lo resuelve supabaseClient.js
// (persistSession + autoRefreshToken): la sesión sobrevive a recargar la
// página o cerrar el navegador hasta que el token de refresco expire o
// la persona cierre sesión explícitamente.
export default function LoginScreen({ onClose }) {
  const { signIn } = useAuth();
  const emailRecordado = localStorage.getItem(CLAVE_EMAIL_RECORDADO) || '';
  const [email, setEmail] = useState(emailRecordado);
  const [password, setPassword] = useState('');
  const [recordar, setRecordar] = useState(!!emailRecordado);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await signIn(email, password);
      if (recordar) localStorage.setItem(CLAVE_EMAIL_RECORDADO, email);
      else localStorage.removeItem(CLAVE_EMAIL_RECORDADO);
      onClose?.();
    } catch (err) {
      setError('No se pudo iniciar sesión. Verifique el correo y la contraseña.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      style={onClose ? undefined : { display: 'grid', placeItems: 'center', minHeight: '100vh', width: '100%' }}
      className={onClose ? 'viewer' : undefined}
      onClick={onClose ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
    >
      <form onSubmit={handleSubmit} className="hero" style={{ width: 360, maxWidth: '90vw', position: 'relative' }}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{ position: 'absolute', top: 14, right: 14, background: 'transparent', border: 0, color: 'inherit', fontSize: 18, cursor: 'pointer', opacity: 0.75 }}
          >
            ✕
          </button>
        )}
        <h1>Presencia · ICBF</h1>
        <p>Inicie sesión con la cuenta que le asignó el equipo para guardar su trabajo.</p>
        <div style={{ marginTop: 16 }}>
          <TextField
            label="Correo"
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <TextField
            label="Contraseña"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: '0.9em' }}>
          <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} />
          Recordar mi correo en este dispositivo
        </label>
        {error && (
          <div style={{ marginTop: 12 }}>
            <Callout variant="warn">{error}</Callout>
          </div>
        )}
        <button type="submit" className="fbtn2 primary" style={{ marginTop: 16, width: '100%' }} disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
