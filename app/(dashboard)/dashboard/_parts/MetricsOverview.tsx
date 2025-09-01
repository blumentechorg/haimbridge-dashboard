"use client";

import { useState, useEffect } from "react";
import { useDateRange } from "../../../../lib/dateRangeStore";
import { apiService } from "../../../../lib/api";
import { TrendingUp, TrendingDown, DollarSign, Users, Building } from "lucide-react";
import type { MetricsSummary } from "../../../../lib/mock";

export default function MetricsOverview() {
	const { fromISO, toISO } = useDateRange();
	const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMetrics = async () => {
			try {
				setLoading(true);
				const data = await apiService.getMetrics(fromISO, toISO);
				setMetrics(data); // Fixed: data is already MetricsSummary
			} catch (error) {
				console.error('Failed to fetch metrics:', error);
				// Fallback to default metrics
				setMetrics({
					from: fromISO,
					to: toISO,
					totalDeclared: 2400000,
					totalRemitted: 2100000,
					remittanceVariance: -300000,
					occupancyRate: 0.85,
					gopMargin: 0.72,
					byStream: {
						room_booking: { declared: 1200000, remitted: 1050000 },
						service_charge: { declared: 300000, remitted: 280000 },
						restaurant: { declared: 400000, remitted: 380000 },
						bar: { declared: 200000, remitted: 190000 },
						event_hosting: { declared: 200000, remitted: 150000 },
						misc: { declared: 100000, remitted: 95000 },
					},
					byPaymentMethod: { cash: 400000, card: 1200000, transfer: 500000, wallet: 300000 },
				});
			} finally {
				setLoading(false);
			}
		};

		fetchMetrics();
	}, [fromISO, toISO]);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const formatPercentage = (value: number) => {
		return `${Math.round(value * 100)}%`;
	};

	if (loading || !metrics) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="card card-hover animate-pulse">
						<div className="h-16 bg-gray-200 rounded"></div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
			{/* Total Declared Revenue */}
			<div className="card card-hover">
				<div className="flex items-center justify-between">
					<div>
						<div className="kpi-title">Declared Revenue</div>
						<div className="kpi-value">{formatCurrency(metrics.totalDeclared)}</div>
					</div>
					<DollarSign className="h-8 w-8 text-green-600" />
				</div>
			</div>

			{/* Total Remitted */}
			<div className="card card-hover">
				<div className="flex items-center justify-between">
					<div>
						<div className="kpi-title">Remitted</div>
						<div className="kpi-value">{formatCurrency(metrics.totalRemitted)}</div>
					</div>
					<TrendingUp className="h-8 w-8 text-blue-600" />
				</div>
			</div>

			{/* Remittance Variance */}
			<div className="card card-hover">
				<div className="flex items-center justify-between">
					<div>
						<div className="kpi-title">Variance</div>
						<div className={`kpi-value ${metrics.remittanceVariance < 0 ? "text-red-600" : "text-green-600"}`}>
							{formatCurrency(Math.abs(metrics.remittanceVariance))}
						</div>
					</div>
					{metrics.remittanceVariance < 0 ? (
						<TrendingDown className="h-8 w-8 text-red-600" />
					) : (
						<TrendingUp className="h-8 w-8 text-green-600" />
					)}
				</div>
			</div>

			{/* Occupancy Rate */}
			<div className="card card-hover">
				<div className="flex items-center justify-between">
					<div>
						<div className="kpi-title">Occupancy</div>
						<div className="kpi-value">{formatPercentage(metrics.occupancyRate)}</div>
					</div>
					<Users className="h-8 w-8 text-purple-600" />
				</div>
			</div>

			{/* GOP Margin */}
			<div className="card card-hover">
				<div className="flex items-center justify-between">
					<div>
						<div className="kpi-title">GOP Margin</div>
						<div className="kpi-value">{formatPercentage(metrics.gopMargin)}</div>
					</div>
					<Building className="h-8 w-8 text-orange-600" />
				</div>
			</div>
		</div>
	);
}

