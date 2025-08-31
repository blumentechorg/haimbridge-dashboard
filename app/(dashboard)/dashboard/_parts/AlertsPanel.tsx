"use client";

import useSWR from "swr";
import type { AlertItem } from "../../../../lib/mock";
import { useDateRange } from "../../../../lib/dateRangeStore";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AlertsPanel() {
	const { fromISO, toISO } = useDateRange();
	const { data } = useSWR(`/api/alerts?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`, fetcher, { refreshInterval: 20000 });
	const alerts: AlertItem[] = (data?.alerts as AlertItem[]) ?? [];
	return (
		<div className="border rounded p-4">
			<div className="mb-3 font-medium">Alerts</div>
			<div className="space-y-2">
				{alerts.length === 0 && <div className="text-sm text-gray-500">No alerts</div>}
				{alerts.map((a: AlertItem) => (
					<div key={a.id} className={`text-sm border rounded p-2 ${a.severity === "high" ? "border-red-500" : a.severity === "medium" ? "border-yellow-500" : "border-gray-300"}`}>
						<div className="flex items-center justify-between">
							<span className="font-medium capitalize">{a.severity}</span>
							<span className="text-xs text-gray-500">{new Date(a.date).toLocaleString()}</span>
						</div>
						<div>{a.message}</div>
						<div className="text-xs text-gray-600">Variance: ${typeof a.variance === "number" ? a.variance.toLocaleString() : a.variance}</div>
					</div>
				))}
			</div>
		</div>
	);
}

