"use client";

import { useState, useEffect } from "react";
import { useDateRange } from "../../../../lib/dateRangeStore";
import { apiService } from "../../../../lib/api";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { MetricsSummary } from "../../../../lib/mock";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function PaymentsPie() {
	const { fromISO, toISO } = useDateRange();
	const [data, setData] = useState<MetricsSummary | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const metrics = await apiService.getMetrics(fromISO, toISO);
				setData(metrics);
			} catch (error) {
				console.error('Failed to fetch metrics:', error);
				// Fallback to mock data
				setData({
					from: fromISO,
					to: toISO,
					totalDeclared: 24000000,
					totalRemitted: 21000000,
					remittanceVariance: 3000000,
					occupancyRate: 0.85,
					gopMargin: 0.72,
					byStream: {
						room_booking: { declared: 12000000, remitted: 11000000 },
						service_charge: { declared: 3000000, remitted: 2800000 },
						restaurant: { declared: 4000000, remitted: 3800000 },
						bar: { declared: 2000000, remitted: 1900000 },
						event_hosting: { declared: 2000000, remitted: 1500000 },
						misc: { declared: 1000000, remitted: 950000 },
					},
					byPaymentMethod: { cash: 4000000, card: 12000000, transfer: 5000000, wallet: 3000000 },
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [fromISO, toISO]);

	const chartData = data
		? Object.keys(data.byPaymentMethod).map((method) => ({
			name: method.charAt(0).toUpperCase() + method.slice(1),
			value: data.byPaymentMethod[method as keyof typeof data.byPaymentMethod],
		}))
		: [];

	if (loading) {
		return (
			<div className="card card-hover p-8 h-[320px]">
				<div className="animate-pulse space-y-4">
					<div className="h-4 bg-gray-200 rounded w-1/3"></div>
					<div className="h-64 bg-gray-200 rounded-full w-64 mx-auto"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="card card-hover p-8 h-[320px]">
			<div className="mb-2 font-medium">Payment Methods</div>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={chartData}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
						outerRadius={80}
						fill="#8884d8"
						dataKey="value"
					>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
					<Tooltip 
						formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
					/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}

