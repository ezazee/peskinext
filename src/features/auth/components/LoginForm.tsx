"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "../action";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    // Add callbackUrl from query params if exists
    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl) {
      formData.append("callbackUrl", callbackUrl);
    }

    try {
      const result = await login(formData);

      if (result.success) {
        // Force full page reload untuk update header
        window.location.href = result.redirectTo || "/";
      } else {
        setError(result.error || "Login gagal");
      }
    } catch (_err) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="emailOrPhone"
          className="block text-sm font-medium text-subtle-text mb-1"
        >
          Nomor HP atau Email
        </label>
        <input
          type="text"
          id="emailOrPhone"
          name="emailOrPhone"
          placeholder="Contoh: user1@example.com"
          className="w-full border border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-subtle-text mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Masukkan password"
          className="w-full border border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      <div className="text-right mb-4">
        <a href="#" className="text-sm font-bold text-primary hover:underline">
          Lupa password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full font-bold py-3 rounded-lg transition-colors ${
          isLoading
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-primary text-white hover:opacity-90"
        }`}
      >
        {isLoading ? "Loading..." : "Masuk"}
      </button>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
        <p className="font-semibold mb-2">Demo Credentials:</p>
        <ul className="text-xs space-y-1">
          <li>Email: <code>user1@example.com</code></li>
          <li>Email: <code>demo@peskinpro.com</code></li>
          <li>Password: <code>password123</code> (semua user)</li>
        </ul>
      </div>
    </form>
  );
}
