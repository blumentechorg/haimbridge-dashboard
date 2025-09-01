"use client";

import { useState, useMemo } from "react";
import { useDateRange } from "../../../../lib/dateRangeStore";
import { apiService } from "../../../../lib/api";
import { AlertTriangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { AlertItem } from "../../../../lib/mock";

export default function AlertsPanel() {
	const { fromISO, toISO } = useDateRange();
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [data, setData] = useState<AlertItem[]>([]);
	const [loading, setLoading] = useState(true);

	// Mock data for now - replace with actual API call
	useMemo(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const alerts = await apiService.getAlerts();
				setData(alerts);
			} catch (error) {
				console.error('Failed to fetch alerts:', error);
				// Fallback to mock data
				const mockAlerts: AlertItem[] = [
					{
						id: "1",
						severity: "high",
						message: "Under-remittance detected for room_booking",
						date: "2024-01-15T10:30:00Z",
						variance: 150000,
					},
					{
						id: "2",
						severity: "medium",
						message: "Under-remittance detected for restaurant",
						date: "2024-01-15T14:20:00Z",
						variance: 5000,
					},
					{
						id: "3",
						severity: "low",
						message: "Under-remittance detected for bar",
						date: "2024-01-15T16:45:00Z",
						variance: 2000,
					},
					{
						id: "4",
						severity: "high",
						message: "Large variance on event_hosting transaction",
						date: "2024-01-15T18:30:00Z",
						variance: 10000,
					},
					{
						id: "5",
						severity: "medium",
						message: "Under-remittance detected for service_charge",
						date: "2024-01-15T20:15:00Z",
						variance: 3000,
					},
					{
						id: "6",
						severity: "low",
						message: "Under-remittance detected for misc",
						date: "2024-01-16T09:00:00Z",
						variance: 1500,
					},
					{
						id: "7",
						severity: "high",
						message: "Large variance on room_booking transaction",
						date: "2024-01-16T12:30:00Z",
						variance: 25000,
					},
					{
						id: "8",
						severity: "medium",
						message: "Under-remittance detected for restaurant",
						date: "2024-01-16T15:45:00Z",
						variance: 8000,
					},
					{
						id: "9",
						severity: "low",
						message: "Under-remittance detected for bar",
						date: "2024-01-16T17:20:00Z",
						variance: 1200,
					},
					{
						id: "10",
						severity: "medium",
						message: "Under-remittance detected for event_hosting",
						date: "2024-01-16T19:00:00Z",
						variance: 15000,
					},
					{
						id: "11",
						severity: "high",
						message: "Large variance on room_booking transaction",
						date: "2024-01-17T08:30:00Z",
						variance: 30000,
					},
					{
						id: "12",
						severity: "medium",
						message: "Under-remittance detected for restaurant",
						date: "2024-01-17T11:15:00Z",
						variance: 6000,
					},
				];
				setData(mockAlerts);
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
								<div key={i} className="h-16 bg-gray-200 rounded"></div>
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
						<h2 className="text-lg font-semibold">Financial Alerts</h2>
						<div className="flex items-center gap-2">
							<label htmlFor="alertsRowsPerPage" className="text-sm text-gray-600">Rows per page:</label>
							<select
								id="alertsRowsPerPage"
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

					<div className="space-y-3">
						{currentData.map((a) => (
							<div key={a.id} className={`text-sm border rounded p-3 ${
								a.severity === "high" ? "border-red-500 bg-red-50" : 
								a.severity === "medium" ? "border-yellow-500 bg-yellow-50" : 
								"border-gray-300 bg-gray-50"
							}`}>
								<div className="flex items-start gap-3">
									<AlertTriangle className={`h-5 w-5 mt-0.5 ${
										a.severity === "high" ? "text-red-600" : 
										a.severity === "medium" ? "text-yellow-600" : 
										"text-gray-600"
									}`} />
									<div className="flex-1">
										<div className="font-medium text-gray-900">{a.message}</div>
										<div className="text-xs text-gray-600 mt-1">
											{new Date(a.date).toLocaleDateString()} • Variance: ₦{typeof a.variance === "number" ? a.variance.toLocaleString() : a.variance}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Pagination Controls */}
					{data.length > 0 && (
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
					)}

					{/* No Alerts Message */}
					{data.length === 0 && !loading && (
						<div className="text-center py-8 text-gray-500">
							<AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
							<p>No financial alerts for the selected period.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

