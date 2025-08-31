import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold">Financial Monitoring Dashboard</h1>
        <p className="text-gray-600">Access hotel financials and remittances.</p>
        <Link href="/dashboard" className="inline-block bg-black text-white rounded px-4 py-2">Go to Dashboard</Link>
      </div>
    </div>
  );
}
