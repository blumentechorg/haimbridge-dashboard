// app/dashboard/page.jsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../dashboard/components/Sidebar";
import Topbar from "../dashboard/components/Topbar";
import StatCard from "../dashboard/components/StatCard";
import TransactionsTable from "../dashboard/components/TransactionTable";
import ReconciliationReport from "../dashboard/components/ReconciliationReport";
import { getToken } from "../../lib/auth"; // reads owner_token cookie

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // redirect to login if not authenticated (mock token not present)
    const t = getToken();
    if (!t) {
      router.push("/auth/login");
    }
  }, [router]);

  // Basic layout — adjust or replace components as needed
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value="₦ 24,350"
          subtitle="Updated live"
        />
        <StatCard
          title="Total Received"
          value="₦ 65,214"
          subtitle="Paid transactions"
        />
        <StatCard
          title="Total Due"
          value="₦ 12,400"
          subtitle="Unpaid invoices"
        />
        <StatCard
          title="Upcoming Invoices"
          value="₦ 4,923"
          subtitle="Next 7 days"
        />
      </div>

      <div className="grid grid-cols-1  gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-3">Transactions</h2>
          <TransactionsTable />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-3">Reconciliation</h2>
          <ReconciliationReport />
        </div>
      </div>
    </>
  );
}
