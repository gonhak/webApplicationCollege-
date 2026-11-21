import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { login } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      setUser(await login({ email, password }));
      navigate('/cars', { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nie udało się zalogować.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="content-section form-page auth-page">
      <p className="eyebrow">Witaj ponownie</p>
      <h1>Logowanie</h1>
      <p className="section-intro">Zaloguj się, aby otworzyć swój katalog samochodów.</p>
      <form className="car-form auth-form" onSubmit={(event) => void handleSubmit(event)}>
        {error && <p className="form-error" role="alert">{error}</p>}
        <label>E-mail<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Hasło<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logowanie…' : 'Zaloguj się'}</button>
        <p><Link className="text-link" to="/forgot-password">Nie pamiętasz hasła?</Link></p>
        <p>Nie masz konta? <Link className="text-link" to="/register">Zarejestruj się</Link></p>
      </form>
    </section>
  );
}
