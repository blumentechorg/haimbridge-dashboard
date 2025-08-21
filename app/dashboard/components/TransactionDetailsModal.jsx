// app/dashboard/components/TransactionDetailsModal.jsx
"use client";

import {
  formatCurrency,
  calculateOwnerShare,
  percentDiff,
} from "../../../lib/utils";

export default function TransactionDetailsModal({ tx, onClose }) {
  const expectedOwner = calculateOwnerShare(tx);
  const reportedOwner = Number(tx.owner_share ?? 0);
  const diff = reportedOwner - expectedOwner;
  const diffPct = percentDiff(expectedOwner, reportedOwner);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full z-10 p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">
            Transaction — {tx.invoice_no}
          </h3>
          <button onClick={onClose} className="text-gray-500">
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-xs text-gray-500">Guest</div>
            <div className="font-medium">{tx.guest_name}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Date</div>
            <div>{tx.date ? new Date(tx.date).toLocaleString() : "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Amount</div>
            <div className="font-medium">{formatCurrency(tx.amount)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Status</div>
            <div>{tx.status}</div>
          </div>
        </div>

        <hr className="my-4" />

        <h4 className="text-sm font-semibold mb-2">Reconciliation</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-500">Agency Share</div>
            <div className="font-medium">
              {formatCurrency(tx.agency_amount)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Owner (reported)</div>
            <div className="font-medium">{formatCurrency(reportedOwner)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Owner (expected)</div>
            <div className="font-medium">{formatCurrency(expectedOwner)}</div>
          </div>
        </div>

        <div className="mt-4">
          <div
            className={`text-sm ${
              Math.abs(diffPct) > 1 ? "text-red-600" : "text-gray-700"
            }`}
          >
            Difference: {formatCurrency(diff)} ({diffPct.toFixed(2)}%)
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Owner percent used: {tx.owner_percentage ?? "from config"}
          </div>
        </div>

        {tx.notes && (
          <>
            <hr className="my-4" />
            <div>
              <div className="text-xs text-gray-500">Notes</div>
              <div className="mt-1 text-sm">{tx.notes}</div>
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <a
            className="px-4 py-2 rounded border"
            href={`mailto:manager@example.com?subject=Discrepancy:${tx.invoice_no}&body=Hi,%0A%0AI noticed a discrepancy on invoice ${tx.invoice_no}.`}
          >
            Contact Manager
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
