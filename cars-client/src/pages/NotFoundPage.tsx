import { Link } from 'react-router';

export default function NotFoundPage() {
  return <section className="empty-state not-found"><p className="eyebrow">404 · Nieznany adres</p><h1>Tej drogi jeszcze nie ma.</h1><p>Sprawdź adres albo wróć na stronę główną.</p><Link className="button button-primary" to="/">Strona główna</Link></section>;
}
