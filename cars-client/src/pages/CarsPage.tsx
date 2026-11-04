import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { getBodyLabel, getFuelLabel } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getCars(controller.signal)
      .then(setCars)
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) setError(loadError instanceof Error ? loadError.message : 'Nie udało się pobrać listy aut.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  async function handleDelete(car: Car) {
    const confirmed = window.confirm(`Czy na pewno chcesz usunąć samochód ${car.brand} ${car.model}?`);
    if (!confirmed) return;
    setDeletingId(car.id);
    setError('');
    try {
      await deleteCar(car.id);
      setCars((current) => current.filter((item) => item.id !== car.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Nie udało się usunąć samochodu.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="content-section">
      <div className="section-heading">
        <div><p className="eyebrow">Kolekcja</p><h1>Samochody</h1><p className="section-intro">Twoje auta i ich najważniejsze dane.</p></div>
        <Link className="button button-primary" to="/cars/new">+ Dodaj samochód</Link>
      </div>
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      {loading ? <div className="notice">Ładowanie samochodów…</div> : cars.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">◇</span><h2>Tu jeszcze pusto</h2><p>Dodaj pierwszy samochód do swojej kolekcji.</p><Link className="button button-primary" to="/cars/new">Dodaj samochód</Link></div>
      ) : (
        <div className="car-grid">
          {cars.map((car, index) => (
            <article className="car-card" key={car.id}>
              <div className={`car-card-art car-art-${index % 3}`} aria-hidden="true">
                <span className="car-number">{String(index + 1).padStart(2, '0')}</span>
                <svg viewBox="0 0 400 140" role="presentation"><path d="M40 94c8-21 20-32 45-38l51-12 36-31c8-7 17-10 29-10h56c15 0 27 7 37 19l31 38 33 12c14 5 22 16 22 29v14H28v-9c0-6 5-10 12-12Z" fill="currentColor"/><path d="m180 46 32-28c5-5 12-8 20-8h52c10 0 18 5 25 13l22 27H180Z" fill="#c5dcd2"/><path d="M248 10v40m-70 0h153" stroke="#183b36" strokeWidth="5"/><circle cx="105" cy="111" r="24" fill="#f6f1e8"/><circle cx="105" cy="111" r="12" fill="#183b36"/><circle cx="326" cy="111" r="24" fill="#f6f1e8"/><circle cx="326" cy="111" r="12" fill="#183b36"/></svg>
              </div>
              <div className="car-card-body">
                <div className="car-card-title"><div><p className="eyebrow">{car.productionDate.slice(0, 4) || 'Rocznik'}</p><h2>{car.brand} {car.model}</h2></div><span className="car-tag">{getBodyLabel(car.bodyType)}</span></div>
                <div className="car-meta"><span>{car.engineCapacity} cm³</span><span>{getFuelLabel(car.fuelType)}</span><span>{car.averageFuelConsumption} l/100 km</span></div>
                <div className="card-actions"><Link className="text-link" to={`/cars/${car.id}`}>Szczegóły <span aria-hidden="true">→</span></Link><button className="button button-danger-quiet" type="button" disabled={deletingId === car.id} onClick={() => void handleDelete(car)}>{deletingId === car.id ? 'Usuwanie…' : 'Usuń'}</button></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
