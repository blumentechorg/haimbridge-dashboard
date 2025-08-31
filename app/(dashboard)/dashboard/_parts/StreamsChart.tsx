"use client";

import useSWR from "swr";
import { useDateRange } from "../../../../lib/dateRangeStore";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function StreamsChart() {
	const { fromISO, toISO } = useDateRange();
	const { data } = useSWR(`/api/metrics?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`, fetcher, { refreshInterval: 15000 });
	const s = data?.summary as {
		byStream: Record<string, { declared: number; remitted: number }>;
	};
	const chartData = s
		? Object.keys(s.byStream).map((k) => ({
			stream: k.replace("_", " "),
			declared: s.byStream[k].declared,
			remitted: s.byStream[k].remitted,
		}))
		: [];
	return (
		<div className="border rounded p-8 h-[320px]">
			<div className="mb-2 font-medium">Revenue by Stream</div>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="stream" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="declared" fill="#8884d8" />
					<Bar dataKey="remitted" fill="#00A63E" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

