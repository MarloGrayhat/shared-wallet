import { create } from 'zustand';
import { CategoryId } from './categories';

export type Member = { id: string; firstName: string; lastName: string };
export type Trip = {
  id: string; title: string; country: string; startDate: string; endDate: string;
  budget: number; currency: 'RUB'; cover: [string, string]; memberIds: string[]; adminId: string;
};
export type Expense = {
  id: string; tripId: string; title: string; amount: number; category: CategoryId;
  payerId: string; splitIds: string[]; date: string;
};
/** A confirmed repayment from one member to another. */
export type Transfer = { id: string; tripId: string; fromId: string; toId: string; amount: number };

export const COVERS: [string, string][] = [
  ['#667EEA', '#764BA2'], ['#F093FB', '#F5576C'], ['#43CEA2', '#185A9D'], ['#F7971E', '#FFD200'], ['#56AB2F', '#A8E063'],
];

const members: Member[] = [
  { id: 'a', firstName: 'Алексей', lastName: 'Иванов' },
  { id: 'm', firstName: 'Мария', lastName: 'Петрова' },
  { id: 'd', firstName: 'Дмитрий', lastName: 'Сидоров' },
  { id: 'e', firstName: 'Елена', lastName: 'Смирнова' },
];

const ALL = ['a', 'm', 'd', 'e'];

const trips: Trip[] = [
  { id: 'sochi', title: 'Сочи', country: 'Россия', startDate: '2026-05-15', endDate: '2026-05-22', budget: 40000, currency: 'RUB', cover: COVERS[0], memberIds: ALL, adminId: 'a' },
  { id: 'kazan', title: 'Казань', country: 'Россия', startDate: '2026-06-01', endDate: '2026-06-07', budget: 32000, currency: 'RUB', cover: COVERS[1], memberIds: ['a', 'm', 'd'], adminId: 'a' },
];

const expenses: Expense[] = [
  { id: 'x1', tripId: 'sochi', title: 'Завтрак в кафе', amount: 1600, category: 'food', payerId: 'm', splitIds: ALL, date: '2026-05-15' },
  { id: 'x2', tripId: 'sochi', title: 'Продукты в супермаркете', amount: 2150, category: 'shopping', payerId: 'e', splitIds: ALL, date: '2026-05-15' },
  { id: 'x3', tripId: 'sochi', title: 'Аптека и мелочи', amount: 1400, category: 'other', payerId: 'd', splitIds: ALL, date: '2026-05-16' },
  { id: 'x4', tripId: 'sochi', title: 'Билеты в парк развлечений', amount: 3200, category: 'fun', payerId: 'd', splitIds: ALL, date: '2026-05-16' },
  { id: 'x5', tripId: 'sochi', title: 'Аренда жилья (2 ночи)', amount: 12000, category: 'housing', payerId: 'a', splitIds: ALL, date: '2026-05-16' },
  { id: 'x6', tripId: 'sochi', title: 'Такси до отеля', amount: 850, category: 'transport', payerId: 'm', splitIds: ALL, date: '2026-05-17' },
  { id: 'x7', tripId: 'sochi', title: 'Ужин в ресторане «Белые ночи»', amount: 4800, category: 'food', payerId: 'a', splitIds: ALL, date: '2026-05-17' },
];

const transfers: Transfer[] = [{ id: 't1', tripId: 'sochi', fromId: 'e', toId: 'a', amount: 500 }];

let seq = 100;
const id = (p: string) => `${p}${++seq}`;

type State = {
  currentUserId: string;
  members: Member[]; trips: Trip[]; expenses: Expense[]; transfers: Transfer[];
  addTrip: (t: Omit<Trip, 'id' | 'memberIds' | 'adminId' | 'currency'>) => string;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  confirmTransfer: (t: Omit<Transfer, 'id'>) => void;
};

export const useStore = create<State>((set, get) => ({
  currentUserId: 'a',
  members, trips, expenses, transfers,
  addTrip: (t) => {
    const tripId = id('trip');
    const me = get().currentUserId;
    set((s) => ({ trips: [{ ...t, id: tripId, currency: 'RUB', memberIds: [me], adminId: me }, ...s.trips] }));
    return tripId;
  },
  addExpense: (e) => set((s) => ({ expenses: [...s.expenses, { ...e, id: id('x') }] })),
  confirmTransfer: (t) => set((s) => ({ transfers: [...s.transfers, { ...t, id: id('t') }] })),
}));
