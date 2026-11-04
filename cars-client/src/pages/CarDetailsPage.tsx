import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getBodyLabel, getFuelLabel } from '../models/Car';
import { getCarById } from '../services/carService';

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    getCarById(id, controller.signal)
      .then(setCar)
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) setError(loadError instanceof Error ? loadError.message : 'Nie udało się pobrać danych samochodu.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  if (loading) return <div className="notice">Ładowanie szczegółów…</div>;
  if (error) return <section className="content-section"><p className="notice notice-error" role="alert">{error}</p><Link className="text-link" to="/cars">← Wróć do listy</Link></section>;
  if (!car) return <section className="content-section"><div className="empty-state"><h1>Nie znaleziono samochodu</h1><p>Samochód o podanym identyfikatorze nie istnieje.</p><Link className="button button-primary" to="/cars">Wróć do listy</Link></div></section>;

  return (
    <section className="content-section">
      <Link className="back-link" to="/cars">← Wszystkie samochody</Link>
      <div className="detail-hero"><div><p className="eyebrow">{car.productionDate.slice(0, 4)} · {getBodyLabel(car.bodyType)}</p><h1>{car.brand} {car.model}</h1><p className="section-intro">Dane techniczne samochodu w Twojej kolekcji.</p></div><Link className="button button-primary" to={`/cars/${car.id}/edit`}>Edytuj dane</Link></div>
      <div className="detail-panel"><h2>Specyfikacja</h2><dl className="detail-grid">
        <div><dt>Marka</dt><dd>{car.brand}</dd></div><div><dt>Model</dt><dd>{car.model}</dd></div>
        <div><dt>Liczba drzwi</dt><dd>{car.doorsNumber}</dd></div><div><dt>Pojemność bagażnika</dt><dd>{car.luggageCapacity} l</dd></div>
        <div><dt>Pojemność silnika</dt><dd>{car.engineCapacity} cm³</dd></div><div><dt>Rodzaj paliwa</dt><dd>{getFuelLabel(car.fuelType)}</dd></div>
        <div><dt>Data produkcji</dt><dd>{car.productionDate}</dd></div><div><dt>Średnie spalanie</dt><dd>{car.averageFuelConsumption} l/100 km</dd></div>
        <div><dt>Typ nadwozia</dt><dd>{getBodyLabel(car.bodyType)}</dd></div>
      </dl></div>
    </section>
  );
}
