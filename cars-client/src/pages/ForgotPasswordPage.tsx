import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { forgotPassword } from '../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);
    try {
      setMessage(await forgotPassword(email));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nie udało się wysłać instrukcji.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="content-section form-page auth-page">
      <p className="eyebrow">Odzyskiwanie dostępu</p>
      <h1>Reset hasła</h1>
      <p className="section-intro">Podaj adres e-mail konta. Jeśli jest zarejestrowany, wyślemy instrukcję zmiany hasła.</p>
      <form className="car-form auth-form" onSubmit={(event) => void handleSubmit(event)}>
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="notice" role="status">{message}</p>}
        <label>E-mail<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Wysyłanie…' : 'Wyślij instrukcję'}</button>
        <p><Link className="text-link" to="/login">Wróć do logowania</Link></p>
      </form>
    </section>
  );
}
