"use client";
import { useEffect, useState } from "react";
import api from "../lib/axios";
import { getToken } from "../lib/auth";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getToken();
    if (!t) {
      setLoading(false);
      return;
    }
    let mounted = true;
    api
      .get("/owner/profile")
      .then((res) => {
        if (mounted) setUser(res.data);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  return { user, loading };
}
