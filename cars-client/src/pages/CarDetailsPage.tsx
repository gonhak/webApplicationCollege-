import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getBodyLabel, getFuelLabel } from '../models/Car';
import { getCarById } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

  useEffect(() => {
    const carId = id ?? '';
    if (carId.length === 0) return;
    const controller = new AbortController();

    async function loadCar() {
      try {
        setLoading(true);
        setError('');
        setCar(await getCarById(carId, controller.signal));
      } catch (caughtError) {
        if (axios.isCancel(caughtError)) return;
        setError(caughtError instanceof Error ? caughtError.message : 'Nie udało się pobrać danych samochodu.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCar();
    return () => controller.abort();
  }, [id]);

  if (loading) return <div className="notice">Ładowanie szczegółów…</div>;
  if (error) return <section className="content-section"><p className="notice notice-error" role="alert">{error}</p><Link className="text-link" to="/cars">← Wróć do listy</Link></section>;
  if (!car) return <section className="content-section"><div className="empty-state"><h1>Nie znaleziono samochodu</h1><p>Samochód o podanym identyfikatorze nie istnieje.</p><Link className="button button-primary" to="/cars">Wróć do listy</Link></div></section>;

  const isFavorite = favoriteCarIds.includes(car.id);

  return (
    <section className="content-section">
      <Link className="back-link" to="/cars">← Wszystkie samochody</Link>
      <div className="detail-hero">
        <div><p className="eyebrow">{car.productionDate.slice(0, 4)} · {getBodyLabel(car.bodyType)}</p><h1>{car.brand} {car.model}</h1><p className="section-intro">Dane techniczne samochodu w Twojej kolekcji.</p></div>
        <div className="detail-actions">
          <button className={`favorite-button${isFavorite ? ' active-favorite' : ''}`} type="button" aria-pressed={isFavorite} onClick={() => toggleFavorite(car.id)}>
            {isFavorite ? 'Usuń z ulubionych ★' : 'Dodaj do ulubionych ☆'}
          </button>
          <Link className="button button-primary" to={`/cars/${car.id}/edit`}>Edytuj dane</Link>
        </div>
      </div>
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
