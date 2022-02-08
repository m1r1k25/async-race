import {
  IGetCars,
  ICar,
  IWinner,
  IWinners,
  ISaveWinner,
  IUpdateStateGarage,
} from './models/response.model';

const garage = 'http://localhost:3000/garage';
const engine = 'http://localhost:3000/engine';
const winners = 'http://localhost:3000/winners';

export const getCars = async ({ page, limit = 7 }: IGetCars): Promise<IUpdateStateGarage> => {
  const res = await fetch(`${garage}?_page=${page}&_limit=${limit}`);
  return {
    items: await res.json(),
    count: res.headers.get('X-Total-Count'),
  };
};

export const getCar = async (id: number): Promise<ICar> => (await fetch(`${garage}/${id}`)).json();

export const createCar = async (body: { name: string, color: string }): Promise<ICar> => (await fetch(garage, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
  },
})).json();

export const deleteCar = async (id: number): Promise<ICar> => (await fetch(`${garage}/${id}`, { method: 'DELETE' })).json();

export const updateCar = async (id: number, body: ICar): Promise<ICar> => (await fetch(`${garage}/${id}`, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
  },
})).json();

export const startEngine = async (id: number): Promise<{ velocity: number, distance: number }> => (await fetch(`${engine}?id=${id}&status=started`, { method: 'PATCH' })).json();

export const stopEngine = async (id: number): Promise<{ velocity: number, distance: number }> => (await fetch(`${engine}?id=${id}&status=stopped`, { method: 'PATCH' })).json();

export const drive = async (id: number): Promise<{ success: boolean }> => {
  const res = await fetch(`${engine}?id=${id}&status=drive`, { method: 'PATCH' }).catch();
  return res.status !== 200 ? { success: false } : { ...(await res.json()) };
};

export const getSortOrder = (sort: string | null | undefined, order: string | null | undefined): string => {
  if (sort && order) return `&_sort=${sort}&_order=${order}`;
  return '';
};

export const getWinners = async ({
  page,
  limit,
  sort,
  order,
}: IWinners): Promise<{ items: Array<ICar>; count: string | null; }> => {
  const res = await fetch(`${winners}?_page=${page}$_limit=${limit}${getSortOrder(sort, order)}`);
  const items = await res.json();
  return {
    items: await Promise.all(items.map(async (winner: IWinner) => ({ ...winner, car: await getCar(winner.id) }))),
    count: res.headers.get('X-Total-Count'),
  };
};

export const getWinner = async (id: number): Promise<ISaveWinner> => (await fetch(`${winners}/${id}`)).json();

export const getWinnersStatus = async (id: number): Promise<number> => (await fetch(`${winners}/${id}`)).status;

export const deleteWinner = async (id: number): Promise<IWinner> => (await fetch(`${winners}/${id}`, { method: 'DELETE' })).json();

export const createWinner = async (body: IWinner): Promise<IWinner> => (await fetch(winners, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
  },
})).json();

export const updateWinner = async (id: number, body: IWinner): Promise<IWinner> => (await fetch(`${winners}/${id}`, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
  },
})).json();

export const saveWinner = async ({ id, time }: IWinner): Promise<void> => {
  const winnerStatus = await getWinnersStatus(id);

  if (winnerStatus === 404) {
    await createWinner({
      id,
      wins: 1,
      time,
    });
  } else {
    const winner = await getWinner(id);
    await updateWinner(id, {
      id,
      wins: (winner.wins as number) + 1,
      time: time < winner.time ? time : winner.time,
    });
  }
};
