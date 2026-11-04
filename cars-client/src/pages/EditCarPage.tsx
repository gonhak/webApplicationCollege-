import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import CarForm from '../components/CarForm';
import type { Car, NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    getCarById(id, controller.signal)
      .then(setCar)
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) setError(loadError instanceof Error ? loadError.message : 'Nie udało się pobrać samochodu.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  async function handleUpdate(values: NewCar) {
    if (!id) return;
    await updateCar(id, values);
    navigate(`/cars/${id}`);
  }

  if (loading) return <div className="notice">Ładowanie samochodu…</div>;
  if (error) return <section className="content-section"><p className="notice notice-error" role="alert">{error}</p><Link className="text-link" to="/cars">← Wróć do listy</Link></section>;
  if (!car) return <section className="content-section"><div className="empty-state"><h1>Nie znaleziono samochodu</h1><Link className="button button-primary" to="/cars">Wróć do listy</Link></div></section>;

  const initialValues: NewCar = {
    brand: car.brand,
    model: car.model,
    doorsNumber: car.doorsNumber,
    luggageCapacity: car.luggageCapacity,
    engineCapacity: car.engineCapacity,
    fuelType: car.fuelType,
    productionDate: car.productionDate.slice(0, 10),
    averageFuelConsumption: car.averageFuelConsumption,
    bodyType: car.bodyType,
  };

  return <section className="content-section form-page"><p className="eyebrow">Edycja danych</p><h1>{car.brand} {car.model}</h1><p className="section-intro">Zmień wybrane informacje. Zapis wyśle pełne dane samochodu.</p><CarForm key={car.id} initialValues={initialValues} submitLabel="Zapisz zmiany" onSubmit={handleUpdate} cancelTo={`/cars/${car.id}`} /></section>;
}
