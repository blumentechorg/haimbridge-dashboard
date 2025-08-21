// app/dashboard/components/Topbar.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, clearToken } from "@/lib/auth";

export default function Topbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      setLoading(true);
      try {
        // If no token, skip fetching
        if (!getToken()) {
          if (mounted) setUser(null);
          return;
        }
        const res = await api.get("/owner/profile");
        // mock API returns object directly; real API may wrap in data
        const profile = res?.data ?? res;
        if (mounted) setUser(profile);
      } catch (err) {
        console.error("Failed to load profile", err);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  function handleLogout() {
    clearToken();
    router.push("/auth/login");
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-lg">
          {/* small icon */}
          🏨
        </div>

        <div>
          <div className="text-sm text-gray-500">Welcome back,</div>
          <div className="text-sm font-medium text-gray-900">
            {loading ? "Loading…" : user?.name ?? "Owner"}
          </div>
          {!loading && user?.email && (
            <div className="text-xs text-gray-500">{user.email}</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded border text-sm hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
