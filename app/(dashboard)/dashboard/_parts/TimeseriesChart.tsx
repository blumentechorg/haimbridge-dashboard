"use client";

import useSWR from "swr";
import { useDateRange } from "../../../../lib/dateRangeStore";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Txn = {
	id: string;
	date: string;
	stream: string;
	paymentMethod: string;
	amountDeclared: number;
	amountRemitted: number;
	roomNights?: number;
};

export default function TimeseriesChart() {
	const { fromISO, toISO } = useDateRange();
	const { data } = useSWR(`/api/transactions?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`, fetcher, { refreshInterval: 15000 });
	const rows: Txn[] = data?.data ?? [];

	const byDay: Record<string, { declared: number; remitted: number; occupancyN: number; occupancyD: number }> = {};
	for (const r of rows) {
		const day = r.date.slice(0, 10);
		byDay[day] ||= { declared: 0, remitted: 0, occupancyN: 0, occupancyD: 0 };
		byDay[day].declared += r.amountDeclared;
		byDay[day].remitted += r.amountRemitted;
		if (r.stream === "room_booking") {
			byDay[day].occupancyN += r.roomNights ?? 0;
			byDay[day].occupancyD += 3;
		}
	}
	const chartData = Object.keys(byDay)
		.sort()
		.map((d) => ({
			date: d,
			declared: Math.round(byDay[d].declared * 100) / 100,
			remitted: Math.round(byDay[d].remitted * 100) / 100,
			occupancy: byDay[d].occupancyD ? Math.round((byDay[d].occupancyN / byDay[d].occupancyD) * 100) : 0,
		}));

	return (
		<div className="border rounded p-8 h-[360px]">
			<div className="mb-2 font-medium">Declared vs Remitted (with Occupancy%)</div>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis yAxisId="left" />
					<YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
					<Tooltip />
					<Legend />
					<Line yAxisId="left" type="monotone" dataKey="declared" stroke="#8884d8" dot={false} />
					<Line yAxisId="left" type="monotone" dataKey="remitted" stroke="#82ca9d" dot={false} />
					<Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="#ff7300" dot={false} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

