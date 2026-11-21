import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { resetPassword } from '../services/authService';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !token) return;
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      setMessage(await resetPassword(email, token, newPassword));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nie udało się zmienić hasła.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!email || !token) {
    return <section className="content-section form-page auth-page"><h1>Nieprawidłowy link</h1><p>Link resetujący nie zawiera adresu e-mail lub tokenu.</p><Link className="text-link" to="/login">Wróć do logowania</Link></section>;
  }

  return (
    <section className="content-section form-page auth-page">
      <p className="eyebrow">Odzyskiwanie dostępu</p>
      <h1>Ustaw nowe hasło</h1>
      <form className="car-form auth-form" onSubmit={(event) => void handleSubmit(event)}>
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="notice" role="status">{message}</p>}
        <label>Nowe hasło<input type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
        <p className="form-hint">Hasło musi mieć co najmniej 8 znaków, w tym wielką i małą literę oraz cyfrę.</p>
        <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Zapisywanie…' : 'Zmień hasło'}</button>
      </form>
      <p><Link className="text-link" to="/login">Przejdź do logowania</Link></p>
    </section>
  );
}
