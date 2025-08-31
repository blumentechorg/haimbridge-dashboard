"use client";

import { useDateRange } from "../../../../lib/dateRangeStore";

export default function DateRangePicker() {
	const { fromISO, toISO, setRange } = useDateRange();

	return (
		<div className="flex items-center gap-2 text-sm">
			<label className="flex items-center gap-2">
				<span>From</span>
				<input
					type="date"
					value={fromISO.slice(0, 10)}
					onChange={(e) => setRange(new Date(e.target.value).toISOString(), toISO)}
					className="border rounded px-2 py-1 bg-transparent"
				/>
			</label>
			<label className="flex items-center gap-2">
				<span>To</span>
				<input
					type="date"
					value={toISO.slice(0, 10)}
					onChange={(e) => setRange(fromISO, new Date(e.target.value).toISOString())}
					className="border rounded px-2 py-1 bg-transparent"
				/>
			</label>
		</div>
	);
}

