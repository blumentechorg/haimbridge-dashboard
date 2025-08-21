// app/dashboard/components/TransactionsTable.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../../lib/axios";
import TransactionDetailsModal from "./TransactionDetailsModal";
import {
  formatCurrency,
  calculateOwnerShare,
  percentDiff,
} from "../../../lib/utils";

export default function TransactionsTable() {
  // UI state
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all"); // all | paid | due | refunded
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [total, setTotal] = useState(0);

  // modal
  const [selectedTx, setSelectedTx] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // fetch function
  async function fetchTransactions() {
    setLoading(true);
    try {
      const params = {
        page,
        per_page: perPage,
      };
      if (query) params.q = query;
      if (status && status !== "all") params.status = status;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await api.get("/owner/transactions", { params });
      // expected response shape { data: [...], meta: { total, page, per_page } }
      const data = res.data?.data ?? res.data ?? [];
      const meta = res.data?.meta ?? {};
      setTransactions(Array.isArray(data) ? data : []);
      setTotal(meta.total ?? (Array.isArray(data) ? data.length : 0));
    } catch (err) {
      console.error("Fetch transactions error", err);
      setTransactions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  // simple client-side filter for quick search (applies on top of server fetch)
  const filtered = useMemo(() => {
    if (!query) return transactions;
    return transactions.filter((t) => {
      const q = query.toLowerCase();
      return (
        (t.invoice_no ?? "").toString().toLowerCase().includes(q) ||
        (t.guest_name ?? "").toLowerCase().includes(q) ||
        (t.payment_reference ?? "").toLowerCase().includes(q)
      );
    });
  }, [transactions, query]);

  function openDetails(tx) {
    setSelectedTx(tx);
    setShowModal(true);
  }

  function closeDetails() {
    setSelectedTx(null);
    setShowModal(false);
  }

  function downloadCSV(rows = filtered) {
    if (!rows || rows.length === 0) {
      alert("No rows to export");
      return;
    }
    const headers = [
      "invoice_no",
      "date",
      "guest_name",
      "amount",
      "agency_amount",
      "owner_share_reported",
      "owner_share_expected",
      "owner_share_diff",
      "status",
      "notes",
    ];
    const csvRows = [headers.join(",")];
    rows.forEach((r) => {
      const expected = calculateOwnerShare(r);
      const diff = (r.owner_share ?? 0) - expected;
      const row = [
        `"${r.invoice_no ?? ""}"`,
        `"${r.date ? new Date(r.date).toISOString() : ""}"`,
        `"${(r.guest_name ?? "").replace(/"/g, "'")}"`,
        `${r.amount ?? ""}`,
        `${r.agency_amount ?? ""}`,
        `${r.owner_share ?? ""}`,
        `${expected}`,
        `${diff}`,
        `"${r.status ?? ""}"`,
        `"${(r.notes ?? "").replace(/"/g, "'")}"`,
      ];
      csvRows.push(row.join(","));
    });
    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_page_${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoice, guest or ref"
            className="border px-3 py-2 rounded w-64"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="due">Due</option>
            <option value="refunded">Refunded</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded"
            title="Start date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded"
            title="End date"
          />
          <button
            onClick={() => {
              setPage(1);
              fetchTransactions();
            }}
            className="px-3 py-2 bg-gray-100 rounded"
          >
            Apply
          </button>
          <button
            onClick={() => {
              setQuery("");
              setStatus("all");
              setStartDate("");
              setEndDate("");
              setPage(1);
              fetchTransactions();
            }}
            className="px-3 py-2 bg-gray-50 rounded"
          >
            Reset
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => downloadCSV()}
            className="px-3 py-2 bg-purple-600 text-white rounded"
          >
            Export CSV
          </button>
          <div className="text-sm text-gray-500">
            Showing {filtered.length} / {total}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-6">Loading transactions…</div>
        ) : (
          <table className="min-w-full text-left">
            <thead className="text-xs text-gray-500 border-b">
              <tr>
                <th className="py-3 px-4">Invoice</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Agency</th>
                <th className="py-3 px-4">Owner (reported)</th>
                <th className="py-3 px-4">Owner (expected)</th>
                <th className="py-3 px-4">Diff</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const expectedOwner = calculateOwnerShare(tx);
                const reportedOwner = Number(tx.owner_share ?? 0);
                const diff = reportedOwner - expectedOwner;
                const diffPct = percentDiff(expectedOwner, reportedOwner);
                const isMismatch = Math.abs(diffPct) > 1.0; // flag if >1%
                return (
                  <tr
                    key={tx.id ?? tx.invoice_no}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{tx.invoice_no}</td>
                    <td className="py-3 px-4">{tx.guest_name}</td>
                    <td className="py-3 px-4">
                      {tx.date ? new Date(tx.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-3 px-4">{formatCurrency(tx.amount)}</td>
                    <td className="py-3 px-4">
                      {formatCurrency(tx.agency_amount)}
                    </td>
                    <td className="py-3 px-4">
                      {formatCurrency(reportedOwner)}
                    </td>
                    <td className="py-3 px-4">
                      {formatCurrency(expectedOwner)}
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        isMismatch
                          ? "text-red-600 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {formatCurrency(diff)} ({diffPct.toFixed(2)}%)
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === "paid"
                            ? "bg-green-50 text-green-700"
                            : tx.status === "due"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {tx.status ?? "unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetails(tx)}
                          className="px-3 py-1 bg-gray-100 rounded text-sm"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Page {page} / {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded"
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && selectedTx && (
        <TransactionDetailsModal tx={selectedTx} onClose={closeDetails} />
      )}
    </div>
  );
}
