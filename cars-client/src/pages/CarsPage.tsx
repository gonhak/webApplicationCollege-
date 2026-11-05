import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import CarCard from '../components/CarCard';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const searchTerm = useCarUiStore((state) => state.searchTerm);
  const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
  const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
  const setShowFavoritesOnly = useCarUiStore((state) => state.setShowFavoritesOnly);
  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCars() {
      try {
        setLoading(true);
        setError('');
        setCars(await getCars(controller.signal));
      } catch (caughtError) {
        if (axios.isCancel(caughtError)) return;
        setError(caughtError instanceof Error ? caughtError.message : 'Wystąpił nieznany błąd.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCars();
    return () => controller.abort();
  }, []);

  async function handleDelete(car: Car) {
    if (!window.confirm(`Czy na pewno chcesz usunąć samochód ${car.brand} ${car.model}?`)) return;

    setDeletingId(car.id);
    setError('');
    try {
      await deleteCar(car.id);
      removeFavorite(car.id);
      setCars((current) => current.filter((item) => item.id !== car.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Nie udało się usunąć samochodu.');
    } finally {
      setDeletingId(null);
    }
  }

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase('pl');
  const visibleCars = cars.filter((car) => {
    const matchesSearch = `${car.brand} ${car.model}`.toLocaleLowerCase('pl').includes(normalizedSearch);
    const matchesFavorite = !showFavoritesOnly || favoriteCarIds.includes(car.id);
    return matchesSearch && matchesFavorite;
  });

  return (
    <section className="content-section">
      <div className="section-heading">
        <div><p className="eyebrow">Kolekcja</p><h1>Samochody</h1><p className="section-intro">Twoje auta i ich najważniejsze dane.</p></div>
        <Link className="button button-primary" to="/cars/new">+ Dodaj samochód</Link>
      </div>
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      {cars.length > 0 && (
        <div className="cars-toolbar">
          <label className="search-field">
            <span className="visually-hidden">Szukaj samochodu po marce lub modelu</span>
            <input
              type="search"
              placeholder="Szukaj po marce lub modelu…"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <label className="favorite-filter">
            <input type="checkbox" checked={showFavoritesOnly} onChange={(event) => setShowFavoritesOnly(event.target.checked)} />
            Tylko ulubione
          </label>
        </div>
      )}
      {loading ? <div className="notice">Ładowanie samochodów…</div> : cars.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">◇</span><h2>Tu jeszcze pusto</h2><p>Dodaj pierwszy samochód do swojej kolekcji.</p><Link className="button button-primary" to="/cars/new">Dodaj samochód</Link></div>
      ) : visibleCars.length === 0 ? (
        <div className="empty-state"><h2>Brak pasujących samochodów</h2><p>Zmień wyszukiwanie lub wyłącz filtr ulubionych.</p></div>
      ) : (
        <div className="car-grid">
          {visibleCars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} deleting={deletingId === car.id} onDelete={(item) => void handleDelete(item)} />
          ))}
        </div>
      )}
    </section>
  );
}
