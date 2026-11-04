import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { bodyTypes, emptyCar, fuelTypes, type NewCar } from '../models/Car';

interface CarFormProps {
  initialValues?: NewCar;
  submitLabel: string;
  onSubmit: (car: NewCar) => Promise<void>;
  cancelTo?: string;
}

export default function CarForm({
  initialValues = emptyCar,
  submitLabel,
  onSubmit,
  cancelTo = '/cars',
}: CarFormProps) {
  const [car, setCar] = useState<NewCar>({ ...initialValues });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const setText = (field: 'brand' | 'model' | 'productionDate', value: string) => {
    setCar((current) => ({ ...current, [field]: value }));
  };

  const setNumber = (
    field: 'doorsNumber' | 'luggageCapacity' | 'engineCapacity' | 'averageFuelConsumption',
    value: string,
  ) => {
    setCar((current) => ({ ...current, [field]: Number(value) }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(car);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nie udało się zapisać samochodu.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>Marka</span>
          <input required maxLength={50} value={car.brand} onChange={(event) => setText('brand', event.target.value)} placeholder="np. Toyota" />
        </label>
        <label className="field">
          <span>Model</span>
          <input required maxLength={50} value={car.model} onChange={(event) => setText('model', event.target.value)} placeholder="np. Corolla" />
        </label>
        <label className="field">
          <span>Liczba drzwi</span>
          <input type="number" min={2} max={5} required value={car.doorsNumber} onChange={(event) => setNumber('doorsNumber', event.target.value)} />
        </label>
        <label className="field">
          <span>Pojemność bagażnika (l)</span>
          <input type="number" min={0} required value={car.luggageCapacity} onChange={(event) => setNumber('luggageCapacity', event.target.value)} />
        </label>
        <label className="field">
          <span>Pojemność silnika (cm³)</span>
          <input type="number" min={1} required value={car.engineCapacity} onChange={(event) => setNumber('engineCapacity', event.target.value)} />
        </label>
        <label className="field">
          <span>Rodzaj paliwa</span>
          <select value={car.fuelType} onChange={(event) => setCar((current) => ({ ...current, fuelType: Number(event.target.value) }))}>
            {fuelTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Data produkcji</span>
          <input type="date" required value={car.productionDate} onInput={(event) => setText('productionDate', event.currentTarget.value)} onChange={(event) => setText('productionDate', event.currentTarget.value)} />
        </label>
        <label className="field">
          <span>Średnie spalanie (l/100 km)</span>
          <input type="number" min={0.1} step="0.1" required value={car.averageFuelConsumption} onChange={(event) => setNumber('averageFuelConsumption', event.target.value)} />
        </label>
        <label className="field">
          <span>Typ nadwozia</span>
          <select value={car.bodyType} onChange={(event) => setCar((current) => ({ ...current, bodyType: Number(event.target.value) }))}>
            {bodyTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <Link className="button button-quiet" to={cancelTo}>Anuluj</Link>
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? 'Zapisywanie…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
