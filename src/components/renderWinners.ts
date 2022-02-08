import store from '../store';
import { renderCarImage } from './renderCarImage';
import { IRenderWinners, ICar } from '../models/response.model';

export const renderWinners = (): string => `
  <h1>Winners (${store.winnersCount})</h1>
  <h2>Page #${store.winnersPage}</h2>
  <table class="table" cellspacing="0" border="0" cellpadding="0">
    <thead>
      <th>Number</th>
      <th>Car</th>
      <th>Name</th>
      <th class="table-button table-wins ${store.sortBy === 'wins' ? store.sortOrder : ''}" id="sort-by-wins">Wins</th>
      <th class="table-button table-time ${store.sortBy === 'time' ? store.sortOrder : ''}" id="sort-by-time">Best time (seconds)</th>
    </thead>
    <tbody>
      ${store.winners.map((item: IRenderWinners, index: number): string => `
        <tr>
          <td>${index + 1}</td>
          <td>${renderCarImage((item.car as ICar).color)}</td>
          <td>${(item.car as ICar).name}</td>
          <td>${item.wins}</td>
          <td>${item.time}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`;
