import store from '../store';
import { renderCar } from './renderCar';
import { ICar } from '../models/response.model';

export const renderGarage = (): string => `
  <h1>Garage (${store.carsCount})</h1>
  <h2>Page № ${store.carsPage}</h2>
  <ul class="garage">
    ${store.cars.map((car: ICar) => `
      <li>${renderCar(car)}</li>
    `).join('')}
  </ul>
`;
