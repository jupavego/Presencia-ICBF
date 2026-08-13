import { useState } from 'react';
import { TextField } from '../ui/Field.jsx';
import Callout from '../ui/Callout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Puerta de acceso: sin sesión, la app no muestra ningún dato — solo este
// formulario. No hay registro público, ver AuthContext.jsx.
export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await signIn(email, password);
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
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
