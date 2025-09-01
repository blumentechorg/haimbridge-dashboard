"use client";

import { useState, useEffect } from "react";
import { useDateRange } from "../../../../lib/dateRangeStore";
import { apiService } from "../../../../lib/api";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MetricsSummary } from "../../../../lib/mock";

export default function StreamsChart() {
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
		? Object.keys(data.byStream).map((k) => ({
			stream: k.replace("_", " "),
			declared: data.byStream[k as keyof typeof data.byStream].declared,
			remitted: data.byStream[k as keyof typeof data.byStream].remitted,
		}))
		: [];

	if (loading) {
		return (
			<div className="card card-hover p-8 h-[320px]">
				<div className="animate-pulse space-y-4">
					<div className="h-4 bg-gray-200 rounded w-1/3"></div>
					<div className="h-64 bg-gray-200 rounded"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="card card-hover p-8 h-[320px]">
			<div className="mb-2 font-medium">Revenue by Stream</div>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="stream" />
					<YAxis />
					<Tooltip 
						formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
						labelFormatter={(label) => `${label}`}
					/>
					<Legend />
					<Bar dataKey="declared" fill="#8884d8" name="Declared" />
					<Bar dataKey="remitted" fill="#00A63E" name="Remitted" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

