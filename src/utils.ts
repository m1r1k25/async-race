import store from './store';
import {
  ICreateCar,
  IRace,
  IPromiseForRaceAll,
  IAction,
} from './models/response.model';

const OneHundredCars = 100;
const models = ['BMW', 'Audi', 'Volkswagen', 'Ferrari', 'Geely', 'Skoda', 'Lada', 'Opel', 'Toyota', 'Mazda'];
const names = ['Corolla', 'CLK', '7', '3', '5', 'Atlas', '599', 'Rapid', 'Vesta', 'Passat'];

const getRandomName = () => {
  const model = models[Math.floor(Math.random() * models.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  return `${model} ${name}`;
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  const totalLetAndNum = 16;
  const totalLetAndNumInColor = 6;
  let color = '#';
  for (let i = 0; i < totalLetAndNumInColor; i++) {
    color += letters[Math.floor(Math.random() * totalLetAndNum)];
  }
  return color;
};

export const generateRandomCars = (count = OneHundredCars): ICreateCar[] => new Array(count).fill(1).map(() => ({ name: getRandomName(), color: getRandomColor() }));

function getPositionAtCenter(el: HTMLElement) {
  const {
    top,
    left,
    width,
    height,
  } = el.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
}

export function getDistanceBetweenElements(a: HTMLElement, b: HTMLElement): number {
  const aPosition = getPositionAtCenter(a);
  const bPosition = getPositionAtCenter(b);

  return Math.sqrt(((aPosition.x - bPosition.x) ** 2) + ((aPosition.y - bPosition.y) ** 2));
}

export function animation(car: HTMLElement, distance: number, animationTime: number): { id: number; } {
  let start: null | number = null;
  const state = { id: 0 };

  function step(timestamp: number) {
    if (!start) {
      start = timestamp;
    }
    const time = timestamp - start;
    const passed = Math.round((time * distance) / animationTime);
    car.style.transform = `translateX(${Math.min(passed, distance)}px)`;

    if (passed < distance) {
      state.id = window.requestAnimationFrame(step);
    }
  }
  state.id = window.requestAnimationFrame(step);

  return state;
}

export const raceAll = async ({ promises, ids }: IPromiseForRaceAll): Promise<IRace> => {
  const { success, id, time } = await Promise.race(promises);

  if (!success) {
    const failedIndex = ids.findIndex((i) => i === id);
    const restPromises = [...promises.slice(0, failedIndex), ...promises.slice(failedIndex + 1, promises.length)];
    const restIds = [...ids.slice(0, failedIndex), ...ids.slice(failedIndex + 1, ids.length)];
    return raceAll({ promises: restPromises, ids: restIds });
  }

  return { ...store.cars.find((car: { id: number; }) => car.id === id), time: +(time / 1000).toFixed(2) };
};

export const race = async (action: IAction): Promise<IRace> => {
  const promises = store.cars.map(({ id }): Promise<{ success: boolean; id: number; time: number; }> => action(id));

  const winner = await raceAll({ promises, ids: store.cars.map((car: { id: number; }) => car.id) });

  return winner;
};
