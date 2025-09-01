"use client";

import { useState, useMemo } from "react";
import { useDateRange } from "../../../../lib/dateRangeStore";
import { apiService } from "../../../../lib/api";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { Transaction } from "../../../../lib/mock";

export default function TransactionsTable() {
	const { fromISO, toISO } = useDateRange();
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [data, setData] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);

	// Mock data for now - replace with actual API call
	useMemo(() => {
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
					{
						id: "6",
						date: "2024-01-16T09:00:00Z",
						stream: "room_booking",
						paymentMethod: "card",
						amountDeclared: 30000,
						amountRemitted: 30000,
						roomNights: 1,
					},
					{
						id: "7",
						date: "2024-01-16T12:30:00Z",
						stream: "restaurant",
						paymentMethod: "cash",
						amountDeclared: 12000,
						amountRemitted: 11500,
					},
					{
						id: "8",
						date: "2024-01-16T15:45:00Z",
						stream: "bar",
						paymentMethod: "transfer",
						amountDeclared: 4500,
						amountRemitted: 4500,
					},
					{
						id: "9",
						date: "2024-01-16T17:20:00Z",
						stream: "misc",
						paymentMethod: "card",
						amountDeclared: 8000,
						amountRemitted: 7500,
					},
					{
						id: "10",
						date: "2024-01-16T19:00:00Z",
						stream: "room_booking",
						paymentMethod: "wallet",
						amountDeclared: 35000,
						amountRemitted: 35000,
						roomNights: 2,
					},
					{
						id: "11",
						date: "2024-01-17T08:30:00Z",
						stream: "restaurant",
						paymentMethod: "cash",
						amountDeclared: 9500,
						amountRemitted: 9000,
					},
					{
						id: "12",
						date: "2024-01-17T11:15:00Z",
						stream: "bar",
						paymentMethod: "transfer",
						amountDeclared: 2800,
						amountRemitted: 2800,
					},
				];
				setData(mockTransactions);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [fromISO, toISO]);

	// Pagination logic
	const totalPages = Math.ceil(data.length / rowsPerPage);
	const startIndex = (currentPage - 1) * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;
	const currentData = data.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
	};

	const handleRowsPerPageChange = (newRowsPerPage: number) => {
		setRowsPerPage(newRowsPerPage);
		setCurrentPage(1); // Reset to first page when changing rows per page
	};

	if (loading) {
		return (
			<div className="card card-hover">
				<div className="p-6">
					<div className="animate-pulse space-y-4">
						<div className="h-4 bg-gray-200 rounded w-1/4"></div>
						<div className="space-y-3">
							{Array.from({ length: 10 }).map((_, i) => (
								<div key={i} className="h-12 bg-gray-200 rounded"></div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="card card-hover">
				<div className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold">Transaction History</h2>
						<div className="flex items-center gap-2">
							<label htmlFor="rowsPerPage" className="text-sm text-gray-600">Rows per page:</label>
							<select
								id="rowsPerPage"
								value={rowsPerPage}
								onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
								className="border border-gray-300 rounded px-2 py-1 text-sm"
							>
								<option value={5}>5</option>
								<option value={10}>10</option>
								<option value={25}>25</option>
								<option value={50}>50</option>
							</select>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
									<th className="text-left py-3 px-4 font-medium text-gray-700">Stream</th>
									<th className="text-left py-3 px-4 font-medium text-gray-700">Payment Method</th>
									<th className="text-left py-3 px-4 font-medium text-gray-700">Declared</th>
									<th className="text-left py-3 px-4 font-medium text-gray-700">Remitted</th>
									<th className="text-left py-3 px-4 font-medium text-gray-700">Variance</th>
									<th className="text-left py-3 px-4 font-medium text-gray-700">Room Nights</th>
								</tr>
							</thead>
							<tbody>
								{currentData.map((r) => (
									<tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
										<td className="py-3 px-4">{new Date(r.date).toLocaleDateString()}</td>
										<td className="py-3 px-4">{r.stream.replace("_", " ")}</td>
										<td className="py-3 px-4">{r.paymentMethod}</td>
										<td className="py-3 px-4">₦{r.amountDeclared.toLocaleString()}</td>
										<td className="py-3 px-4">₦{r.amountRemitted.toLocaleString()}</td>
										<td className={`py-3 px-4 ${r.amountDeclared - r.amountRemitted > 0 ? "text-red-600" : ""}`}>
											₦{(r.amountDeclared - r.amountRemitted).toLocaleString()}
										</td>
										<td className="py-3 px-4">{r.roomNights || "-"}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Pagination Controls */}
					<div className="flex items-center justify-between mt-6">
						<div className="text-sm text-gray-600">
							Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() => handlePageChange(1)}
								disabled={currentPage === 1}
								className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronsLeft size={16} />
							</button>
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronLeft size={16} />
							</button>
							
							{/* Page Numbers */}
							<div className="flex items-center gap-1">
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									let pageNum;
									if (totalPages <= 5) {
										pageNum = i + 1;
									} else if (currentPage <= 3) {
										pageNum = i + 1;
									} else if (currentPage >= totalPages - 2) {
										pageNum = totalPages - 4 + i;
									} else {
										pageNum = currentPage - 2 + i;
									}
									
									return (
										<button
											key={pageNum}
											onClick={() => handlePageChange(pageNum)}
											className={`px-3 py-2 rounded text-sm ${
												currentPage === pageNum
													? "bg-blue-600 text-white"
													: "border border-gray-300 hover:bg-gray-50"
											}`}
										>
											{pageNum}
										</button>
									);
								})}
							</div>

							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronRight size={16} />
							</button>
							<button
								onClick={() => handlePageChange(totalPages)}
								disabled={currentPage === totalPages}
								className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronsRight size={16} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

