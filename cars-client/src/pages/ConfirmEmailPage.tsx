import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { confirmEmail } from '../services/authService';

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  const started = useRef(false);
  const [message, setMessage] = useState('Potwierdzanie konta…');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId || !token || started.current) return;
    started.current = true;
    void confirmEmail(userId, token)
      .then(setMessage)
      .catch((caughtError: unknown) => {
        setError(caughtError instanceof Error ? caughtError.message : 'Nie udało się potwierdzić konta.');
      });
  }, [userId, token]);

  return (
    <section className="content-section form-page auth-page">
      <p className="eyebrow">Weryfikacja konta</p>
      <h1>{userId && token ? 'Potwierdzenie adresu e-mail' : 'Nieprawidłowy link'}</h1>
      {error ? <p className="notice notice-error" role="alert">{error}</p> : <p className="notice" role="status">{userId && token ? message : 'Link nie zawiera wymaganych danych.'}</p>}
      <Link className="button button-primary" to="/login">Przejdź do logowania</Link>
    </section>
  );
}
