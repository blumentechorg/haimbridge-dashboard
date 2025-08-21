// lib/axios.js
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("owner_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// global response error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      Cookies.remove("owner_token");
      if (typeof window !== "undefined") {
        // redirect to login (owner)
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
