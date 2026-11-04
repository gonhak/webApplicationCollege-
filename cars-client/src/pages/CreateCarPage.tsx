import { useNavigate } from 'react-router';
import CarForm from '../components/CarForm';
import type { NewCar } from '../models/Car';
import { createCar } from '../services/carService';

export default function CreateCarPage() {
  const navigate = useNavigate();

  async function handleCreate(car: NewCar) {
    await createCar(car);
    navigate('/cars');
  }

  return <section className="content-section form-page"><p className="eyebrow">Nowy wpis</p><h1>Dodaj samochód</h1><p className="section-intro">Uzupełnij specyfikację, aby dodać auto do kolekcji.</p><CarForm submitLabel="Dodaj samochód" onSubmit={handleCreate} /></section>;
}
