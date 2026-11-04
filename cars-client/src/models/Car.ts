export interface Car {
  id: string;
  brand: string;
  model: string;
  doorsNumber: number;
  luggageCapacity: number;
  engineCapacity: number;
  fuelType: number;
  productionDate: string;
  averageFuelConsumption: number;
  bodyType: number;
}

export type NewCar = Omit<Car, 'id'>;

export const emptyCar: NewCar = {
  brand: '',
  model: '',
  doorsNumber: 5,
  luggageCapacity: 0,
  engineCapacity: 0,
  fuelType: 0,
  productionDate: '',
  averageFuelConsumption: 0,
  bodyType: 0,
};

export const fuelTypes = [
  { value: 0, label: 'Benzyna' },
  { value: 1, label: 'Diesel' },
  { value: 2, label: 'Hybryda' },
  { value: 3, label: 'Elektryczny' },
  { value: 4, label: 'LPG' },
];

export const bodyTypes = [
  { value: 0, label: 'Hatchback' },
  { value: 1, label: 'Sedan' },
  { value: 2, label: 'Kombi' },
  { value: 3, label: 'SUV' },
  { value: 4, label: 'Roadster' },
];

export function getFuelLabel(value: number): string {
  return fuelTypes.find((item) => item.value === value)?.label ?? 'Nieznany';
}

export function getBodyLabel(value: number): string {
  return bodyTypes.find((item) => item.value === value)?.label ?? 'Nieznany';
}
