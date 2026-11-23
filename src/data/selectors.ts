import { useShallow } from 'zustand/react/shallow';
import { CATEGORY_ORDER, CategoryId } from './categories';
import { Expense, Member, Transfer, Trip, useStore } from './store';

export const initials = (m: Member) => `${m.firstName[0]}${m.lastName[0]}`;
export const fullName = (m: Member) => `${m.firstName} ${m.lastName}`;

/** Everything a trip screen needs, derived from the raw store. */
export function useTrip(tripId: string) {
  const { trip, allMembers, allExpenses, allTransfers } = useStore(
    useShallow((s) => ({
      trip: s.trips.find((t) => t.id === tripId),
      allMembers: s.members,
      allExpenses: s.expenses,
      allTransfers: s.transfers,
    })),
  );
  if (!trip) return null;
  const members = trip.memberIds.map((id) => allMembers.find((m) => m.id === id)!);
  const expenses = allExpenses.filter((e) => e.tripId === tripId);
  const transfers = allTransfers.filter((t) => t.tripId === tripId);
  return { trip, members, expenses, transfers, ...summarize(trip, members, expenses, transfers) };
}

export function useMember() {
  const members = useStore((s) => s.members);
  return (id: string) => members.find((m) => m.id === id)!;
}

export function tripSpent(tripId: string, expenses: Expense[]) {
  return expenses.filter((e) => e.tripId === tripId).reduce((sum, e) => sum + e.amount, 0);
}

function summarize(trip: Trip, members: Member[], expenses: Expense[], transfers: Transfer[]) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const paid = members.map((m) => {
    const amount = expenses.filter((e) => e.payerId === m.id).reduce((sum, e) => sum + e.amount, 0);
    return { member: m, amount, share: total ? amount / total : 0 };
  });

  const byCategory = CATEGORY_ORDER.map((id: CategoryId) => {
    const amount = expenses.filter((e) => e.category === id).reduce((sum, e) => sum + e.amount, 0);
    return { id, amount, share: total ? amount / total : 0 };
  }).filter((c) => c.amount > 0);

  // net > 0: the group owes this member; net < 0: the member owes the group.
  const net: Record<string, number> = Object.fromEntries(members.map((m) => [m.id, 0]));
  for (const e of expenses) {
    net[e.payerId] = (net[e.payerId] ?? 0) + e.amount;
    const part = e.amount / e.splitIds.length;
    for (const id of e.splitIds) net[id] = (net[id] ?? 0) - part;
  }
  for (const t of transfers) {
    net[t.fromId] += t.amount;
    net[t.toId] -= t.amount;
  }

  return {
    total,
    left: trip.budget - total,
    usedShare: trip.budget ? total / trip.budget : 0,
    perPerson: members.length ? total / members.length : 0,
    average: expenses.length ? total / expenses.length : 0,
    paid,
    byCategory,
    debts: settle(net),
  };
}

/** Greedy settlement: largest debtor pays largest creditor until everyone is even. */
function settle(net: Record<string, number>) {
  const debtors = Object.entries(net).filter(([, v]) => v < -0.5).map(([id, v]) => ({ id, v: -v }));
  const creditors = Object.entries(net).filter(([, v]) => v > 0.5).map(([id, v]) => ({ id, v }));
  debtors.sort((a, b) => b.v - a.v);
  creditors.sort((a, b) => b.v - a.v);
  const out: { fromId: string; toId: string; amount: number }[] = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].v, creditors[j].v);
    out.push({ fromId: debtors[i].id, toId: creditors[j].id, amount: Math.round(amount) });
    debtors[i].v -= amount;
    creditors[j].v -= amount;
    if (debtors[i].v < 0.5) i++;
    if (creditors[j].v < 0.5) j++;
  }
  return out;
}
