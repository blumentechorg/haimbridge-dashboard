"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Transaction } from "../../../../lib/mock";
import { useDateRange } from "../../../../lib/dateRangeStore";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TransactionsTable() {
	const { fromISO, toISO } = useDateRange();
	const { data } = useSWR(`/api/transactions?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`, fetcher, { refreshInterval: 15000 });
	const rows = (data?.data as Transaction[]) ?? [];
	const [query, setQuery] = useState("");

	const filtered: Transaction[] = useMemo(() => {
		const source: Transaction[] = rows;
		if (!query) return source;
		const q = query.toLowerCase();
		return source.filter((r) =>
			r.stream.toLowerCase().includes(q) ||
			r.paymentMethod.toLowerCase().includes(q) ||
			(r.remarks ?? "").toLowerCase().includes(q)
		);
	}, [rows, query]);

	function exportCSV() {
		const rowsForCsv = filtered.map((r) => ({
			date: new Date(r.date).toISOString(),
			stream: r.stream,
			paymentMethod: r.paymentMethod,
			amountDeclared: r.amountDeclared,
			amountRemitted: r.amountRemitted,
			variance: Number((r.amountDeclared - r.amountRemitted).toFixed(2)),
		}));
		const csv = Papa.unparse(rowsForCsv);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "transactions.csv";
		a.click();
		URL.revokeObjectURL(url);
	}

	function exportPDF() {
		const doc = new jsPDF();
		autoTable(doc, {
			head: [["Date", "Stream", "Method", "Declared", "Remitted", "Variance"]],
			body: filtered.map((r) => [
				new Date(r.date).toLocaleString(),
				r.stream,
				r.paymentMethod,
				r.amountDeclared,
				r.amountRemitted,
				(r.amountDeclared - r.amountRemitted).toFixed(2),
			]),
		});
		doc.save("transactions.pdf");
	}

	return (
		<div className="border rounded p-4">
			<div className="flex items-center justify-between mb-3">
				<div className="font-medium">Recent Transactions</div>
				<div className="flex gap-2">
					<input
						placeholder="Search..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="border rounded px-2 py-1 bg-transparent"
					/>
					<button onClick={exportCSV} className="border rounded px-2 py-1">Export CSV</button>
					<button onClick={exportPDF} className="border rounded px-2 py-1">Export PDF</button>
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="text-left border-b">
							<th className="py-2 pr-4">Date</th>
							<th className="py-2 pr-4">Stream</th>
							<th className="py-2 pr-4">Method</th>
							<th className="py-2 pr-4">Declared</th>
							<th className="py-2 pr-4">Remitted</th>
							<th className="py-2 pr-4">Variance</th>
						</tr>
					</thead>
					<tbody>
						{filtered.slice(0, 25).map((r) => (
							<tr key={r.id} className="border-b last:border-b-0">
								<td className="py-2 pr-4 whitespace-nowrap">{new Date(r.date).toLocaleString()}</td>
								<td className="py-2 pr-4">{r.stream.replace("_", " ")}</td>
								<td className="py-2 pr-4">{r.paymentMethod}</td>
								<td className="py-2 pr-4">${r.amountDeclared.toLocaleString()}</td>
								<td className="py-2 pr-4">${r.amountRemitted.toLocaleString()}</td>
								<td className={`py-2 pr-4 ${r.amountDeclared - r.amountRemitted > 0 ? "text-red-600" : ""}`}>
									${(r.amountDeclared - r.amountRemitted).toLocaleString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

