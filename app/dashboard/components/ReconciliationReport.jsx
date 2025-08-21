// app/dashboard/components/ReconciliationReport.jsx
"use client";

import { useState } from "react";
import api from "../../../lib/axios";
import { calculateOwnerShare, formatCurrency } from "../../../lib/utils";

export default function ReconciliationReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState(null);

  async function runReport() {
    setRunning(true);
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      // For large date ranges you may need server-side endpoint for streaming / pagination
      const res = await api.get("/owner/transactions", {
        params: { ...params, per_page: 1000 },
      });
      const rows = res.data?.data ?? res.data ?? [];

      let totalAmount = 0;
      let totalReportedOwner = 0;
      let totalExpectedOwner = 0;
      const mismatches = [];

      rows.forEach((r) => {
        const amount = Number(r.amount ?? 0);
        const reportedOwner = Number(r.owner_share ?? 0);
        const expectedOwner = calculateOwnerShare(r);
        totalAmount += amount;
        totalReportedOwner += reportedOwner;
        totalExpectedOwner += expectedOwner;
        const diff = reportedOwner - expectedOwner;
        const diffPct = expectedOwner ? (diff / expectedOwner) * 100 : 0;
        if (Math.abs(diffPct) > 1) {
          mismatches.push({
            ...r,
            expectedOwner,
            reportedOwner,
            diff,
            diffPct,
          });
        }
      });

      setReport({
        rows,
        totalAmount,
        totalReportedOwner,
        totalExpectedOwner,
        mismatches,
      });
    } catch (err) {
      console.error("Reconciliation error", err);
      setReport(null);
      alert("Failed to run reconciliation. See console.");
    } finally {
      setRunning(false);
    }
  }

  function downloadMismatchesCSV() {
    if (!report || !report.mismatches || report.mismatches.length === 0) {
      alert("No mismatches to export.");
      return;
    }
    const headers = [
      "invoice_no",
      "date",
      "guest_name",
      "amount",
      "owner_reported",
      "owner_expected",
      "diff",
      "diff_pct",
      "notes",
    ];
    const rows = [headers.join(",")];
    report.mismatches.forEach((m) => {
      rows.push(
        [
          `"${m.invoice_no}"`,
          `"${m.date ? new Date(m.date).toISOString() : ""}"`,
          `"${(m.guest_name ?? "").replace(/"/g, "'")}"`,
          `${m.amount ?? ""}`,
          `${m.reportedOwner ?? ""}`,
          `${m.expectedOwner ?? ""}`,
          `${m.diff ?? ""}`,
          `${m.diffPct?.toFixed(2) ?? ""}`,
          `"${(m.notes ?? "").replace(/"/g, "'")}"`,
        ].join(",")
      );
    });
    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mismatches_${startDate || "start"}_${endDate || "end"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Reconciliation Report</h3>

      <div className="flex gap-2 items-center mb-3">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={runReport}
          className="px-3 py-2 bg-purple-600 text-white rounded"
          disabled={running}
        >
          {running ? "Running…" : "Run"}
        </button>
        <button
          onClick={downloadMismatchesCSV}
          className="px-3 py-2 border rounded"
          disabled={
            !report || !report.mismatches || report.mismatches.length === 0
          }
        >
          Download mismatches
        </button>
      </div>

      {report && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 border rounded">
            <div className="text-xs text-gray-500">Total Transactions</div>
            <div className="text-xl font-medium">{report.rows.length}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-xs text-gray-500">Total Revenue</div>
            <div className="text-xl font-medium">
              {formatCurrency(report.totalAmount)}
            </div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-xs text-gray-500">
              Owner (Reported vs Expected)
            </div>
            <div className="text-xl font-medium">
              {formatCurrency(report.totalReportedOwner)} /{" "}
              {formatCurrency(report.totalExpectedOwner)}
            </div>
          </div>

          <div className="col-span-3 mt-2">
            <div className="text-sm font-semibold">
              Mismatches ({report.mismatches.length})
            </div>
            <div className="text-xs text-gray-500">
              Rows where reported owner share deviates by &gt;1%
            </div>
            <div className="mt-2">
              {report.mismatches.length === 0 ? (
                <div className="text-sm text-green-600">
                  No significant mismatches found.
                </div>
              ) : (
                <div className="overflow-auto max-h-48 border rounded">
                  <table className="min-w-full text-sm">
                    <thead className="text-xs text-gray-500 bg-gray-50">
                      <tr>
                        <th className="p-2">Invoice</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Reported</th>
                        <th className="p-2">Expected</th>
                        <th className="p-2">Diff %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.mismatches.map((m) => (
                        <tr key={m.id ?? m.invoice_no} className="border-b">
                          <td className="p-2">{m.invoice_no}</td>
                          <td className="p-2">
                            {m.date
                              ? new Date(m.date).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="p-2">{formatCurrency(m.amount)}</td>
                          <td className="p-2">
                            {formatCurrency(m.reportedOwner)}
                          </td>
                          <td className="p-2">
                            {formatCurrency(m.expectedOwner)}
                          </td>
                          <td className="p-2">
                            {(m.diffPct ?? 0).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
