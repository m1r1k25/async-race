import { renderCarImage } from './renderCarImage';
import { ICar } from '../models/response.model';

export const renderCar = ({
  id,
  name,
  color,
  isEngineStarted,
}: ICar): string => `
  <div class="general-buttons">
    <button class="button select-button" id="select-car-${id}">Select</button>
    <button class="button remove-button" id="remove-car-${id}">Remove</button>
    <span class="car-name">${name}</span>
  </div>
  <div class="road">
    <div class="launch-pad">
      <div class="control-panel>
        <button class="icon star-engine-button" id="star-engine-car-${id}" ${isEngineStarted ? 'disabled' : ''}></button>
        <button class="icon start-engine-button" id="start-engine-car-${id}" ${isEngineStarted ? 'disabled' : ''}>A</button>
        <button class="icon stop-engine-button" id="stop-engine-car-${id}" ${!isEngineStarted ? 'disabled' : ''}>B</button>

      </div>
      <div class="car" id="car-${id}">
        ${renderCarImage(color)}
      </div>
    </div>
    <div class="flag" id="flag-${id}">🏁</div>
  </div>
`;
