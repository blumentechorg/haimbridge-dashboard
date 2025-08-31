"use client";

import useSWR from "swr";
import { useDateRange } from "../../../../lib/dateRangeStore";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function PaymentsPie() {
	const { fromISO, toISO } = useDateRange();
	const { data } = useSWR(`/api/metrics?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`, fetcher, { refreshInterval: 15000 });
	const s = data?.summary as {
		byPaymentMethod: Record<string, number>;
	};
	const chartData = s
		? Object.entries(s.byPaymentMethod).map(([name, value]) => ({ name, value }))
		: [];
	return (
		<div className="border rounded p-4 h-[320px]">
			<div className="mb-2 font-medium">Payments Breakdown</div>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
					<Tooltip />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}

