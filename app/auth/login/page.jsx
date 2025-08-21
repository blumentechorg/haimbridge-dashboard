// app/auth/login/page.jsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../../lib/api"; // mock api wrapper
import { saveToken } from "../../../lib/auth";
import { useRouter, useSearchParams } from "next/navigation";

const MOCK_TOKEN = "MOCK_OWNER_TOKEN_ABC123";
const MOCK_EMAIL = "owner@example.com";
const MOCK_PASS = "ownerpass";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: { email: MOCK_EMAIL, password: MOCK_PASS },
  });

  useEffect(() => {
    // If query ?mock=1 present, set token and redirect (auto-login)
    if (searchParams?.get("mock") === "1") {
      saveToken(MOCK_TOKEN);
      router.push("/dashboard");
    }
  }, [searchParams, router]);

  async function onSubmit(data) {
    try {
      // call mock api (or real api when switched)
      const res = await api.post("/auth/login", data);
      const token = res?.token ?? res?.data?.token ?? MOCK_TOKEN;
      saveToken(token);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error", err);
      const message = err?.data?.message || err?.message || "Login failed";
      alert(message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[420px] bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Owner Sign In (Mock)
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block">
            <div className="text-xs text-gray-500">Email</div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              })}
              className="mt-1 w-full border rounded px-3 py-2"
              placeholder="you@example.com"
              onFocus={(e) => setValue("email", e.target.value || MOCK_EMAIL)}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </label>

          <label className="block">
            <div className="text-xs text-gray-500">Password</div>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 3, message: "At least 3 chars" },
              })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </label>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>
              Mock creds:{" "}
              <span className="font-medium text-gray-800">
                owner@example.com / ownerpass
              </span>
            </div>
            <div>
              Or <span className="font-semibold">/auth/login?mock=1</span> to
              auto-login
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-2 rounded"
          >
            {isSubmitting ? "Signing in..." : "LOGIN (Mock)"}
          </button>
        </form>
      </div>
    </div>
  );
}
