export type PaymentMethod = "cash" | "card" | "transfer" | "wallet";
export type RevenueStream =
	| "room_booking"
	| "service_charge"
	| "restaurant"
	| "bar"
	| "event_hosting"
	| "misc";

export interface Transaction {
	id: string;
	date: string; // ISO
	stream: RevenueStream;
	paymentMethod: PaymentMethod;
	amountDeclared: number;
	amountRemitted: number;
	roomNights?: number; // for occupancy-related entries
	remarks?: string;
}

export interface MetricsSummary {
	from: string;
	to: string;
	totalDeclared: number;
	totalRemitted: number;
	remittanceVariance: number; // declared - remitted
	occupancyRate: number; // 0..1
	gopMargin: number; // 0..1, simulated
	byStream: Record<RevenueStream, { declared: number; remitted: number }>;
	byPaymentMethod: Record<PaymentMethod, number>;
}

export interface AlertItem {
	id: string;
	severity: "low" | "medium" | "high";
	message: string;
	date: string;
	variance: number; // positive indicates under-remittance
}

const streams: RevenueStream[] = [
	"room_booking",
	"service_charge",
	"restaurant",
	"bar",
	"event_hosting",
	"misc",
];

const paymentMethods: PaymentMethod[] = ["cash", "card", "transfer", "wallet"];

function seededRandom(seed: number) {
	let state = seed % 2147483647;
	if (state <= 0) state += 2147483646;
	return () => (state = (state * 16807) % 2147483647) / 2147483647;
}

function pick<T>(rand: () => number, arr: T[]): T {
	return arr[Math.floor(rand() * arr.length)];
}

export function generateTransactions(
	from: Date,
	to: Date,
	seed = 42,
	maxPerDay = 60
): Transaction[] {
	const rand = seededRandom(seed);
	const out: Transaction[] = [];
	const dayMs = 24 * 60 * 60 * 1000;
	for (let t = from.getTime(); t <= to.getTime(); t += dayMs) {
		const count = Math.floor(rand() * maxPerDay) + 10;
		for (let i = 0; i < count; i++) {
			const stream = pick(rand, streams);
			const paymentMethod = pick(rand, paymentMethods);
			const base =
				stream === "room_booking"
					? 15000 + rand() * 25000 // ₦15,000 - ₦40,000 per night
					: stream === "event_hosting"
					? 50000 + rand() * 150000 // ₦50,000 - ₦200,000 per event
					: 2000 + rand() * 8000; // ₦2,000 - ₦10,000 for other services
			const declared = Math.round(base * (0.9 + rand() * 0.6) * 100) / 100;
			// Introduce occasional under-remittance
			const underFactor = rand() < 0.2 ? 0.85 + rand() * 0.1 : 1;
			const remitted = Math.round(declared * underFactor * 100) / 100;
			const id = `${t}-${i}`;
			const txn: Transaction = {
				id,
				date: new Date(t + Math.floor(rand() * dayMs)).toISOString(),
				stream,
				paymentMethod,
				amountDeclared: declared,
				amountRemitted: remitted,
				roomNights: stream === "room_booking" ? Math.floor(1 + rand() * 3) : undefined,
				remarks:
					rand() < 0.05
						? "Manual adjustment applied"
						: rand() < 0.05
						? "Complimentary add-on"
						: undefined,
			};
			out.push(txn);
		}
	}
	return out;
}

export function aggregateMetrics(transactions: Transaction[]): MetricsSummary {
	if (transactions.length === 0) {
		const now = new Date().toISOString();
		return {
			from: now,
			to: now,
			totalDeclared: 0,
			totalRemitted: 0,
			remittanceVariance: 0,
			occupancyRate: 0,
			gopMargin: 0,
			byStream: streams.reduce((acc, s) => {
				acc[s] = { declared: 0, remitted: 0 };
				return acc;
			}, {} as Record<RevenueStream, { declared: number; remitted: number }>),
			byPaymentMethod: { cash: 0, card: 0, transfer: 0, wallet: 0 },
		};
	}
	const byStream: Record<RevenueStream, { declared: number; remitted: number }> =
		{
			room_booking: { declared: 0, remitted: 0 },
			service_charge: { declared: 0, remitted: 0 },
			restaurant: { declared: 0, remitted: 0 },
			bar: { declared: 0, remitted: 0 },
			event_hosting: { declared: 0, remitted: 0 },
			misc: { declared: 0, remitted: 0 },
		};
	const byPaymentMethod: Record<PaymentMethod, number> = {
		cash: 0,
		card: 0,
		transfer: 0,
		wallet: 0,
	};

	let totalDeclared = 0;
	let totalRemitted = 0;
	let roomNights = 0;
	let availableRoomNights = 0;

	for (const tx of transactions) {
		byStream[tx.stream].declared += tx.amountDeclared;
		byStream[tx.stream].remitted += tx.amountRemitted;
		byPaymentMethod[tx.paymentMethod] += tx.amountDeclared;
		totalDeclared += tx.amountDeclared;
		totalRemitted += tx.amountRemitted;
		if (tx.stream === "room_booking") {
			roomNights += tx.roomNights ?? 0;
			availableRoomNights += 3; // assume average 3 room-nights offered per related txn (mock)
		}
	}

	const occupancyRate = availableRoomNights
		? Math.min(1, roomNights / availableRoomNights)
		: 0;
	const gopMargin = totalDeclared
		? Math.max(0.2, Math.min(0.65, 0.4 + (totalRemitted - totalDeclared * 0.6) / totalDeclared))
		: 0;

	return {
		from: transactions[0].date,
		to: transactions[transactions.length - 1].date,
		totalDeclared,
		totalRemitted,
		remittanceVariance: Math.max(0, totalDeclared - totalRemitted),
		occupancyRate,
		gopMargin,
		byStream,
		byPaymentMethod,
	};
}

export function detectAlerts(transactions: Transaction[], threshold = 0.08): AlertItem[] {
	const alerts: AlertItem[] = [];
	// Stream-level under-remittance
	const byStream: Record<RevenueStream, { declared: number; remitted: number }> =
		{
			room_booking: { declared: 0, remitted: 0 },
			service_charge: { declared: 0, remitted: 0 },
			restaurant: { declared: 0, remitted: 0 },
			bar: { declared: 0, remitted: 0 },
			event_hosting: { declared: 0, remitted: 0 },
			misc: { declared: 0, remitted: 0 },
		};
	for (const tx of transactions) {
		byStream[tx.stream].declared += tx.amountDeclared;
		byStream[tx.stream].remitted += tx.amountRemitted;
	}
	for (const s of streams) {
		const d = byStream[s].declared;
		const r = byStream[s].remitted;
		if (d > 0 && r / d < 1 - threshold) {
			alerts.push({
				id: `stream-${s}`,
				severity: r / d < 0.8 ? "high" : "medium",
				message: `Under-remittance detected for ${s.replace("_", " ")}`,
				date: new Date().toISOString(),
				variance: Math.round((d - r) * 100) / 100,
			});
		}
	}
	// Large single-transaction discrepancy
	for (const tx of transactions) {
		const variance = tx.amountDeclared - tx.amountRemitted;
		if (variance > 200) {
			alerts.push({
				id: `txn-${tx.id}`,
				severity: "high",
				message: `Large variance on ${tx.stream} transaction`,
				date: tx.date,
				variance: Math.round(variance * 100) / 100,
			});
		}
	}
	return alerts;
}

