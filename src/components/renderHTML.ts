import { renderGarage } from './renderGarage';
import { renderWinners } from './renderWinners';

export const renderHTML = async (): Promise<void> => {
  const html = `
    <div class="menu">
      <button class="button garage-menu-button primary" id="garage-menu">Garage</button>
      <button class="button winners-menu-button primary" id="winners-menu">Winners</button>
    </div>
    <div id="garage-view">
      <div>
        <form class="form" id="create">
          <input class="input" id="create-name" name="name" type="text">
          <input class="color" id="create-color" name="color" type="color" value=#ffffff>
          <button class="button" type="submit">Create</button>
        </form>
        <form class="form" id="update">
          <input class="input" id="update-name" name="name" type="text" disabled>
          <input class="color" id="update-color" name="color" type="color" value=#ffffff disabled>
          <button class="button" id="update-submit" type="submit">Update</button>
        </form>
      </div>
      <div class="race-controls">
        <button class="button race-button primary" id="race">Race</button>
        <button class="button reset-button primary" id="reset">Reset</button>
        <button class="button generator-button" id="generator">Generate cars</button>
      </div>
      <div id="garage">
        ${renderGarage()}
      </div>
      <p class="message" id="message"></p>
    </div>
    <div id="winners-view" style="display: none">
      ${renderWinners()}
    </div>
    <div>
      <button class="button primary prev-button" disabled id="prev">Prev</button>
      <button class="button primary next-button" disabled id="next">Next</button>
    </div>
  `;
  const root = document.createElement('div');
  root.innerHTML = html;
  document.body.appendChild(root);
};
