import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { register } from '../services/authService';

export default function RegisterPage() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirmation) {
      setError('Hasła muszą być identyczne.');
      return;
    }

    setIsSubmitting(true);
    try {
      setMessage(await register({ userName, email, password }));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nie udało się utworzyć konta.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="content-section form-page auth-page">
      <p className="eyebrow">Dołącz do AutoAtlas</p>
      <h1>Rejestracja</h1>
      <p className="section-intro">Po utworzeniu konta potwierdź swój adres e-mail z wiadomości.</p>
      <form className="car-form auth-form" onSubmit={(event) => void handleSubmit(event)}>
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="notice" role="status">{message}</p>}
        <label>Nazwa użytkownika<input autoComplete="username" minLength={2} maxLength={80} required value={userName} onChange={(event) => setUserName(event.target.value)} /></label>
        <label>E-mail<input type="email" autoComplete="email" maxLength={256} required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Hasło<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <label>Powtórz hasło<input type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>
        <p className="form-hint">Hasło musi mieć co najmniej 8 znaków, w tym wielką i małą literę oraz cyfrę.</p>
        <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Tworzenie konta…' : 'Utwórz konto'}</button>
        <p>Masz już konto? <Link className="text-link" to="/login">Zaloguj się</Link></p>
      </form>
    </section>
  );
}
