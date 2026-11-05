import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { getBodyLabel, getFuelLabel } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';

interface CarCardProps {
  car: Car;
  index: number;
  deleting: boolean;
  onDelete: (car: Car) => void;
}

export default function CarCard({ car, index, deleting, onDelete }: CarCardProps) {
  const isFavorite = useCarUiStore((state) => state.favoriteCarIds.includes(car.id));
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

  return (
    <article className="car-card">
      <div className={`car-card-art car-art-${index % 3}`} aria-hidden="true">
        <span className="car-number">{String(index + 1).padStart(2, '0')}</span>
        <svg viewBox="0 0 400 140" role="presentation">
          <path d="M40 94c8-21 20-32 45-38l51-12 36-31c8-7 17-10 29-10h56c15 0 27 7 37 19l31 38 33 12c14 5 22 16 22 29v14H28v-9c0-6 5-10 12-12Z" fill="currentColor" />
          <path d="m180 46 32-28c5-5 12-8 20-8h52c10 0 18 5 25 13l22 27H180Z" fill="#c5dcd2" />
          <path d="M248 10v40m-70 0h153" stroke="#183b36" strokeWidth="5" />
          <circle cx="105" cy="111" r="24" fill="#f6f1e8" />
          <circle cx="105" cy="111" r="12" fill="#183b36" />
          <circle cx="326" cy="111" r="24" fill="#f6f1e8" />
          <circle cx="326" cy="111" r="12" fill="#183b36" />
        </svg>
      </div>
      <div className="car-card-body">
        <div className="car-card-title">
          <div>
            <p className="eyebrow">{car.productionDate.slice(0, 4) || 'Rocznik'}</p>
            <h2>{car.brand} {car.model}</h2>
          </div>
          <span className="car-tag">{getBodyLabel(car.bodyType)}</span>
        </div>
        <div className="car-meta">
          <span>{car.engineCapacity} cm³</span>
          <span>{getFuelLabel(car.fuelType)}</span>
          <span>{car.averageFuelConsumption} l/100 km</span>
        </div>
        <div className="card-actions">
          <Link className="text-link" to={`/cars/${car.id}`}>Szczegóły <span aria-hidden="true">→</span></Link>
          <div className="card-actions-right">
            <button
              className={`favorite-button${isFavorite ? ' active-favorite' : ''}`}
              type="button"
              aria-pressed={isFavorite}
              aria-label={isFavorite ? `Usuń ${car.brand} ${car.model} z ulubionych` : `Dodaj ${car.brand} ${car.model} do ulubionych`}
              onClick={() => toggleFavorite(car.id)}
            >
              {isFavorite ? 'Ulubiony ★' : 'Ulubione ☆'}
            </button>
            <button className="button button-danger-quiet" type="button" disabled={deleting} onClick={() => onDelete(car)}>
              {deleting ? 'Usuwanie…' : 'Usuń'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
