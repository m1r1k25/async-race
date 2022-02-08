import {
  getCar,
  getCars,
  createCar,
  deleteCar,
  updateCar,
  startEngine,
  stopEngine,
  saveWinner,
  getWinners,
  deleteWinner,
  drive,
} from './api';
import store from './store';
import {
  animation,
  getDistanceBetweenElements,
  race,
  generateRandomCars,
} from './utils';
import { renderGarage } from './components/renderGarage';
import { renderWinners } from './components/renderWinners';
import {
  ICar,
  IUpdateStateGarage,
  IStore,
  IWinner,
  ClassName,
  IdName,
} from './models/response.model';

let selectedCar: ICar;

const totalCarsOnPage = 7;
const totalWinnersOnPage = 10;
const onePage = 1;

export const updateStateGarage = async (): Promise<void> => {
  const { items, count }: IUpdateStateGarage = await getCars({ page: store.carsPage, limit: 7 });
  store.cars = items;
  store.carsCount = count;

  if (Number(store.carsPage) * Number(totalCarsOnPage) < Number(store.carsCount)) {
    (document.getElementById(ClassName.NEXT) as HTMLButtonElement).disabled = false;
  } else {
    (document.getElementById(ClassName.NEXT) as HTMLButtonElement).disabled = true;
  }

  if (store.carsPage > onePage) {
    (document.getElementById(ClassName.PREV) as HTMLButtonElement).disabled = false;
  } else {
    (document.getElementById(ClassName.PREV) as HTMLButtonElement).disabled = true;
  }
};

export const updateStateWinners = async (): Promise<void> => {
  const { items, count }: { items: Array<ICar>, count: string | null } = await getWinners({ page: store.winnersPage, sort: store.sortBy, order: store.sortOrder });
  store.winners = items;
  store.winnersCount = count;

  if (Number(store.winnersPage) * Number(totalWinnersOnPage) < Number(store.winnersCount)) {
    (document.getElementById(ClassName.NEXT) as HTMLButtonElement).disabled = false;
  } else {
    (document.getElementById(ClassName.NEXT) as HTMLButtonElement).disabled = true;
  }
  if (store.winnersPage > onePage) {
    (document.getElementById(ClassName.PREV) as HTMLButtonElement).disabled = false;
  } else {
    (document.getElementById(ClassName.PREV) as HTMLButtonElement).disabled = true;
  }
};

const startDriving = async (id: number) => {
  const startButton = <HTMLButtonElement>document.getElementById(`${ClassName.START_ENGINE_CAR}${id}`);
  startButton.disabled = true;
  startButton.classList.add(ClassName.ENABLING);

  const { velocity, distance } = await startEngine(id);
  const time: number = Math.round(distance / velocity);

  startButton.classList.toggle(ClassName.ENABLING, false);
  (document.getElementById(`${ClassName.STOP_ENGINE_CAR}${id}`) as HTMLButtonElement).disabled = false;

  const car = <HTMLElement>document.getElementById(`${ClassName.CAR}${id}`);
  const flag = <HTMLElement>document.getElementById(`${ClassName.FLAG}${id}`);
  const htmlDistance: number = Math.floor(getDistanceBetweenElements(car, flag)) + 100;
  (store as IStore).animation[id] = animation(car, htmlDistance, time);

  const { success } = await drive(id);
  if (!success) window.cancelAnimationFrame((store as IStore).animation[id].id);

  return { success, id, time };
};

const stopDriving = async (id: number): Promise<void> => {
  const stopButton = <HTMLButtonElement>document.getElementById(`${ClassName.STOP_ENGINE_CAR}${id}`);
  stopButton.disabled = true;
  stopButton.classList.toggle(ClassName.ENABLING, true);
  await stopEngine(id);
  stopButton.classList.toggle(ClassName.ENABLING, false);
  (document.getElementById(`${ClassName.START_ENGINE_CAR}${id}`) as HTMLButtonElement).disabled = false;

  const car = <HTMLElement>document.getElementById(`${ClassName.CAR}${id}`);
  car.style.transform = 'translateX(0)';
  if ((store.animation as string)[id]) window.cancelAnimationFrame((store as IStore).animation[id].id);
};

const setSortOrder = async (sortBy: string | null): Promise<void> => {
  (store as IStore).sortOrder = store.sortOrder === 'asc' ? 'desc' : 'asc';
  (store as IStore).sortBy = sortBy;

  await updateStateWinners();
  (document.getElementById(ClassName.WINNERS_VIEW) as HTMLElement).innerHTML = renderWinners();
};

export const listeners = (): void => {
  document.body.addEventListener('click', async (event: Event): Promise<string | undefined> => {
    if ((event.target as HTMLElement).classList.contains(ClassName.START_ENGINE_BUTTON)) {
      const id = +(event.target as HTMLElement).id.split(`${ClassName.START_ENGINE_CAR}`)[1];
      startDriving(id);
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.STOP_ENGINE_BUTTON)) {
      const id = +(event.target as HTMLElement).id.split(`${ClassName.START_ENGINE_CAR}`)[1];
      stopDriving(id);
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.SELECT_BUTTON)) {
      selectedCar = await getCar(+(event.target as Element).id.split(ClassName.SELECT_CAR)[1]);
      (document.getElementById(ClassName.UPDATE_NAME) as HTMLFormElement).value = selectedCar.name;
      (document.getElementById(ClassName.UPDATE_COLOR) as HTMLFormElement).value = selectedCar.color;
      (document.getElementById(ClassName.UPDATE_NAME) as HTMLButtonElement).disabled = false;
      (document.getElementById(ClassName.UPDATE_COLOR) as HTMLButtonElement).disabled = false;
      (document.getElementById(ClassName.UPDATE_SUBMIT) as HTMLButtonElement).disabled = false;
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.REMOVE_BUTTON)) {
      const id = +(event.target as Element).id.split(ClassName.REMOVE_CAR)[1];
      await deleteCar(id);
      await deleteWinner(id);
      await updateStateGarage();
      (document.getElementById(ClassName.GARAGE) as HTMLElement).innerHTML = renderGarage();
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.GENERATOR_BUTTON)) {
      (event.target as HTMLButtonElement).disabled = true;
      const cars = generateRandomCars();
      await Promise.all(cars.map((item): Promise<ICar> => createCar(item)));
      await updateStateGarage();
      (document.getElementById(ClassName.GARAGE) as HTMLElement).innerHTML = renderGarage();
      (event.target as HTMLButtonElement).disabled = false;
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.RACE_BUTTON)) {
      (event.target as HTMLButtonElement).disabled = true;
      const winner = await race(startDriving);
      await saveWinner((winner as IWinner));
      const message = document.getElementById(ClassName.MESSAGE);
      (message as HTMLElement).innerHTML = `${winner.name} went first (${winner.time}s)!`;
      (message as HTMLElement).classList.toggle(ClassName.VISIBLE, true);
      (document.getElementById(ClassName.RESET) as HTMLButtonElement).disabled = false;
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.RESET_BUTTON)) {
      (event.target as HTMLButtonElement).disabled = true;
      store.cars.map(({ id }) => stopDriving(id));
      const message = document.getElementById(ClassName.MESSAGE);
      (message as HTMLElement).classList.toggle(ClassName.VISIBLE, false);
      (document.getElementById(ClassName.RACE) as HTMLButtonElement).disabled = false;
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.PREV_BUTTON)) {
      switch (store.view) {
        case ClassName.GARAGE: {
          store.carsPage--;
          await updateStateGarage();
          (document.getElementById(ClassName.GARAGE) as HTMLElement).innerHTML = renderGarage();
          break;
        }
        case ClassName.WINNERS: {
          store.winnersPage--;
          await updateStateWinners();
          (document.getElementById(ClassName.WINNERS_VIEW) as HTMLElement).innerHTML = renderWinners();
          break;
        }
        default: {
          return '1';
        }
      }
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.NEXT_BUTTON)) {
      switch (store.view) {
        case ClassName.GARAGE: {
          store.carsPage++;
          await updateStateGarage();
          (document.getElementById(ClassName.GARAGE) as HTMLElement).innerHTML = renderGarage();
          break;
        }
        case ClassName.WINNERS: {
          store.winnersPage++;
          await updateStateWinners();
          (document.getElementById(ClassName.WINNERS_VIEW) as HTMLElement).innerHTML = renderWinners();
          break;
        }
        default: {
          return '1';
        }
      }
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.GARAGE_MENU_BUTTON)) {
      (document.getElementById(ClassName.GARAGE_VIEW) as HTMLElement).style.display = 'block';
      (document.getElementById(ClassName.WINNERS_VIEW) as HTMLElement).style.display = 'none';
      store.view = ClassName.GARAGE;
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.WINNERS_MENU_BUTTON)) {
      (document.getElementById(ClassName.WINNERS_VIEW) as HTMLElement).style.display = 'block';
      (document.getElementById(ClassName.GARAGE_VIEW) as HTMLElement).style.display = 'none';
      store.view = ClassName.WINNERS;
      await updateStateWinners();
      (document.getElementById(ClassName.WINNERS_VIEW) as HTMLElement).innerHTML = renderWinners();
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.TABLE_WINS)) {
      setSortOrder('wins');
    }
    if ((event.target as HTMLElement).classList.contains(ClassName.TABLE_TIME)) {
      setSortOrder('time');
    }
    return '1';
  });

  (document.getElementById(ClassName.CREATE) as HTMLButtonElement).addEventListener('submit', async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    const nameValue = (document.querySelector(IdName.CREATE_NAME) as HTMLFormElement).value;
    const colorValue = (document.querySelector(IdName.CREATE_COLOR) as HTMLFormElement).value;
    const car = { name: nameValue, color: colorValue };
    await createCar(car);
    await updateStateGarage();
    (document.getElementById(ClassName.GARAGE) as HTMLElement).innerHTML = renderGarage();
    (document.getElementById(ClassName.CREATE_NAME) as HTMLFormElement).value = '';
    (event.target as HTMLButtonElement).disabled = true;
  });

  (document.getElementById(ClassName.UPDATE) as HTMLButtonElement).addEventListener('submit', async (event) => {
    event.preventDefault();
    const nameValue = (document.querySelector(ClassName.UPDATE_NAME) as HTMLFormElement).value;
    const colorValue = (document.querySelector(ClassName.UPDATE_COLOR) as HTMLFormElement).value;
    const car = { name: nameValue, color: colorValue };
    await updateCar(selectedCar.id, (car as ICar));
    await updateStateGarage();
    (document.getElementById(ClassName.GARAGE) as HTMLElement).innerHTML = renderGarage();
    (document.getElementById(ClassName.UPDATE_NAME) as HTMLFormElement).value = '';
    (document.getElementById(ClassName.UPDATE_NAME) as HTMLButtonElement).disabled = true;
    (document.getElementById(ClassName.UPDATE_COLOR) as HTMLButtonElement).disabled = true;
    (document.getElementById(ClassName.UPDATE_SUBMIT) as HTMLButtonElement).disabled = true;
    (document.getElementById(ClassName.UPDATE_COLOR) as HTMLFormElement).value = '#ffffff';
  });
};
