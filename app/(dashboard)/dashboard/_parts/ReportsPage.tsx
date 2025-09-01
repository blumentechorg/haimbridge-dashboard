"use client";

import { useState } from "react";
import { Download, FileText, BarChart3 } from "lucide-react";
import { apiService } from "../../../../lib/api";
import { useDateRange } from "../../../../lib/dateRangeStore";

export default function ReportsPage() {
	const [isExporting, setIsExporting] = useState(false);
	const { fromISO, toISO } = useDateRange();

	const handleExport = async (format: "csv" | "pdf", reportType: string) => {
		setIsExporting(true);
		try {
			const blob = await apiService.generateReport(reportType, fromISO, toISO);
			
			// Create download link
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${reportType}-report.${format}`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error("Export failed:", error);
			// Fallback to local export
			alert('Report generation failed. Please try again.');
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Financial Reports</h1>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* Revenue Report */}
				<div className="card card-hover p-6">
					<div className="flex items-center gap-3 mb-4">
						<BarChart3 className="h-5 w-5 text-blue-600" />
						<h3 className="font-semibold">Revenue Report</h3>
					</div>
					<p className="text-sm text-gray-600 mb-4">
						Comprehensive revenue analysis including all streams and payment methods.
					</p>
					<div className="flex gap-2">
						<button
							onClick={() => handleExport("csv", "revenue")}
							disabled={isExporting}
							className="btn btn-sm btn-hover flex items-center gap-2"
						>
							<Download className="h-4 w-4" />
							CSV
						</button>
						<button
							onClick={() => handleExport("pdf", "revenue")}
							disabled={isExporting}
							className="btn btn-sm btn-hover flex items-center gap-2"
						>
							<FileText className="h-4 w-4" />
							PDF
						</button>
					</div>
				</div>

				{/* Transaction Report */}
				<div className="card card-hover p-6">
					<div className="flex items-center gap-3 mb-4">
						<FileText className="h-5 w-5 text-green-600" />
						<h3 className="font-semibold">Transaction Report</h3>
					</div>
					<p className="text-sm text-gray-600 mb-4">
						Detailed transaction breakdown with payment methods and categories.
					</p>
					<div className="flex gap-2">
						<button
							onClick={() => handleExport("csv", "transactions")}
							disabled={isExporting}
							className="btn btn-sm btn-hover flex items-center gap-2"
						>
							<Download className="h-4 w-4" />
							CSV
						</button>
						<button
							onClick={() => handleExport("pdf", "transactions")}
							disabled={isExporting}
							className="btn btn-sm btn-hover flex items-center gap-2"
						>
							<FileText className="h-4 w-4" />
							PDF
						</button>
					</div>
				</div>

				{/* Remittance Report */}
				<div className="card card-hover p-6">
					<div className="flex items-center gap-3 mb-4">
						<BarChart3 className="h-5 w-5 text-purple-600" />
						<h3 className="font-semibold">Remittance Report</h3>
					</div>
					<p className="text-sm text-gray-600 mb-4">
						Declared vs actual remittances with discrepancy analysis.
					</p>
					<div className="flex gap-2">
						<button
							onClick={() => handleExport("csv", "remittance")}
							disabled={isExporting}
							className="btn btn-sm btn-hover flex items-center gap-2"
						>
							<Download className="h-4 w-4" />
							CSV
						</button>
						<button
							onClick={() => handleExport("pdf", "remittance")}
							disabled={isExporting}
							className="btn btn-sm btn-hover flex items-center gap-2"
						>
							<FileText className="h-4 w-4" />
							PDF
						</button>
					</div>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="card card-hover p-6">
				<h3 className="font-semibold mb-4">Report Summary</h3>
				<div className="grid gap-4 md:grid-cols-3">
					<div className="text-center">
						<div className="kpi-value">₦24M</div>
						<div className="kpi-title">Total Revenue</div>
					</div>
					<div className="text-center">
						<div className="kpi-value">₦24M</div>
						<div className="kpi-title">Declared Remittance</div>
					</div>
					<div className="text-center">
						<div className="kpi-value">₦21M</div>
						<div className="kpi-title">Actual Remittance</div>
					</div>
				</div>
			</div>
		</div>
	);
}
