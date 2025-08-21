"use client";
export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-xs uppercase text-gray-400">{title}</div>
      <div className="text-2xl font-bold mt-3">{value}</div>
      {subtitle && <div className="text-sm text-gray-400 mt-2">{subtitle}</div>}
    </div>
  );
}
