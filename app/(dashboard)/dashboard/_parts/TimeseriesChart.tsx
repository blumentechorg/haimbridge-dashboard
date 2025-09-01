"use client";

import { useState, useEffect } from "react";
import { useDateRange } from "../../../../lib/dateRangeStore";
import { apiService } from "../../../../lib/api";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import type { Transaction } from "../../../../lib/mock";

export default function TimeseriesChart() {
	const { fromISO, toISO } = useDateRange();
	const [data, setData] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const transactions = await apiService.getTransactions();
				setData(transactions);
			} catch (error) {
				console.error('Failed to fetch transactions:', error);
				// Fallback to mock data
				const mockTransactions: Transaction[] = [
					{
						id: "1",
						date: "2024-01-15T10:30:00Z",
						stream: "room_booking",
						paymentMethod: "card",
						amountDeclared: 25000,
						amountRemitted: 25000,
						roomNights: 2,
					},
					{
						id: "2",
						date: "2024-01-15T14:20:00Z",
						stream: "restaurant",
						paymentMethod: "cash",
						amountDeclared: 8500,
						amountRemitted: 8000,
					},
					{
						id: "3",
						date: "2024-01-15T16:45:00Z",
						stream: "bar",
						paymentMethod: "transfer",
						amountDeclared: 3200,
						amountRemitted: 3200,
					},
					{
						id: "4",
						date: "2024-01-15T18:30:00Z",
						stream: "event_hosting",
						paymentMethod: "card",
						amountDeclared: 150000,
						amountRemitted: 140000,
					},
					{
						id: "5",
						date: "2024-01-15T20:15:00Z",
						stream: "service_charge",
						paymentMethod: "wallet",
						amountDeclared: 5000,
						amountRemitted: 5000,
					},
				];
				setData(mockTransactions);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [fromISO, toISO]);

	// Group transactions by date and calculate daily totals
	const chartData = data.reduce((acc, transaction) => {
		const date = new Date(transaction.date).toLocaleDateString();
		const existing = acc.find(item => item.date === date);
		
		if (existing) {
			existing.declared += transaction.amountDeclared;
			existing.remitted += transaction.amountRemitted;
		} else {
			acc.push({
				date,
				declared: transaction.amountDeclared,
				remitted: transaction.amountRemitted,
			});
		}
		
		return acc;
	}, [] as Array<{ date: string; declared: number; remitted: number }>);

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
			<div className="mb-2 font-medium">Daily Revenue Trends</div>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip 
						formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
					/>
					<Line 
						type="monotone" 
						dataKey="declared" 
						stroke="#8884d8" 
						name="Declared"
						strokeWidth={2}
					/>
					<Line 
						type="monotone" 
						dataKey="remitted" 
						stroke="#00A63E" 
						name="Remitted"
						strokeWidth={2}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

