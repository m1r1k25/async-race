export interface ICar {
  id: number;
  name: string;
  color: string;
  isEngineStarted?: boolean;
}

export interface IWinner {
  id: number;
  wins?: number | undefined;
  time: number;
  car?: ICar;
}

export interface ISaveWinner {
  id: number;
  wins: number | undefined;
  time: number;
}

export interface IRenderWinners {
  id: number;
  wins?: number;
  time?: number;
  car?: ICar;
}

export interface IGetCars {
  page: number;
  limit?: number;
}

export interface ICreateCar {
  name: string;
  color: string;
}

export interface IWinners {
  page: number;
  limit?: number;
  sort?: string | null | undefined;
  order?: string | null | undefined;
}

export interface IUpdateStateGarage {
  items: ICar[];
  count: string | null;
}

export interface IRace {
  time: number;
  id?: number | undefined;
  name?: string | undefined;
  color?: string | undefined;
  isEngineStarted?: boolean | undefined;
}

export interface IStore {
  carsPage: number;
  cars: ICar[];
  carsCount: string | null;
  winnersPage: number;
  winners: ICar[];
  winnersCount: string | null;
  animation: { [key: number]: { id: number } };
  view: string;
  sortBy: string | null;
  sortOrder: string | null;
}

export interface IAction {
  (id: number): Promise<{
    success: boolean;
    id: number;
    time: number;
  }>;
  (arg0: number): Promise<{
    success: boolean;
    id: number;
    time: number;
  }>;
}

export type IPromiseForRaceAll = {
  promises: Promise<{
    success: boolean;
    id: number;
    time: number;
  }>[];
  ids: Array<number>;
};

export const enum ClassName {
  NEXT = 'next',
  PREV = 'prev',
  ENABLING = 'enabling',
  WINNERS_VIEW = 'winners-view',
  START_ENGINE_BUTTON = 'start-engine-button',
  STOP_ENGINE_BUTTON = 'stop-engine-button',
  SELECT_BUTTON = 'select-button',
  UPDATE_NAME = 'update-name',
  UPDATE_COLOR = 'update-color',
  UPDATE_SUBMIT = 'update-submit',
  REMOVE_BUTTON = 'remove-button',
  GARAGE = 'garage',
  GENERATOR_BUTTON = 'generator-button',
  START_ENGINE_CAR = 'start-engine-car-',
  STOP_ENGINE_CAR = 'stop-engine-car-',
  CAR = 'car-',
  FLAG = 'flag-',
  SELECT_CAR = 'select-car-',
  REMOVE_CAR = 'remove-car-',
  RACE_BUTTON = 'race-button',
  MESSAGE = 'message',
  VISIBLE = 'visible',
  RESET = 'reset',
  RESET_BUTTON = 'reset-button',
  RACE = 'race',
  PREV_BUTTON = 'prev-button',
  WINNERS = 'winners',
  NEXT_BUTTON = 'next-button',
  GARAGE_MENU_BUTTON = 'garage-menu-button',
  GARAGE_VIEW = 'garage-view',
  WINNERS_MENU_BUTTON = 'winners-menu-button',
  TABLE_WINS = 'table-wins',
  TABLE_TIME = 'table-time',
  CREATE = 'create',
  CREATE_NAME = 'create-name',
  UPDATE = 'update',
}

export const enum IdName {
  CREATE_NAME = '#create-name',
  CREATE_COLOR = '#create-color',
  UPDATE_NAME = '#update-name',
  UPDATE_COLOR = '#update-color',
}
