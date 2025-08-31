import { create } from "zustand";

export interface DateRangeState {
	fromISO: string; // inclusive
	toISO: string; // inclusive
	setRange: (fromISO: string, toISO: string) => void;
}

function defaultRange() {
	const to = new Date();
	const from = new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000);
	return { fromISO: from.toISOString(), toISO: to.toISOString() };
}

export const useDateRange = create<DateRangeState>((set) => ({
	...defaultRange(),
	setRange: (fromISO: string, toISO: string) => set({ fromISO, toISO }),
}));

