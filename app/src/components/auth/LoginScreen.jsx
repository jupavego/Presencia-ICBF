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

// Puerta de acceso: sin sesión, la app no muestra ningún dato — solo este
// formulario. No hay registro público, ver AuthContext.jsx.
//
// "Mantener sesión iniciada" ya lo resuelve supabaseClient.js
// (persistSession + autoRefreshToken): la sesión sobrevive a recargar la
// página o cerrar el navegador hasta que el token de refresco expire o
// la persona cierre sesión explícitamente.
export default function LoginScreen() {
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
    } catch (err) {
      setError('No se pudo iniciar sesión. Verifique el correo y la contraseña.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', width: '100%' }}>
      <form onSubmit={handleSubmit} className="hero" style={{ width: 360, maxWidth: '90vw' }}>
        <h1>Presencia · ICBF</h1>
        <p>Inicie sesión con la cuenta que le asignó el equipo para acceder al panel.</p>
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
