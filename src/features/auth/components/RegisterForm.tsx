"use client";

import { useState } from "react";
import { register } from "../action";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await register(formData);

      if (result.success) {
        // Force full page reload untuk update header
        window.location.href = result.redirectTo || "/";
      } else {
        setError(result.error || "Registrasi gagal");
      }
    } catch (_err) {
      setError("Terjadi kesalahan saat registrasi");
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

      <div className="mb-6">
        <button
          type="button"
          onClick={() => {
            const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
            window.location.href = `${backendUrl}/api/v1/auth/google`;
          }}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Daftar dengan Google
        </button>
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">atau dengan email</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-subtle-text mb-1"
        >
          Nama Lengkap
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Contoh: John Doe"
          className="w-full border border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-subtle-text mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Contoh: email@example.com"
          className="w-full border border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-subtle-text mb-1"
        >
          Nomor HP (Opsional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Contoh: 08123456789"
          className="w-full border border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
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
          placeholder="Minimal 6 karakter"
          className="w-full border border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          required
          minLength={6}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full font-bold py-3 rounded-lg transition-colors ${isLoading
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-primary text-white hover:opacity-90"
          }`}
      >
        {isLoading ? "Loading..." : "Daftar"}
      </button>

      <p className="text-center text-xs text-subtle-text mt-4">
        Dengan mendaftar, saya menyetujui{" "}
        <a href="#" className="font-bold text-primary">
          Syarat & Ketentuan
        </a>{" "}
        serta{" "}
        <a href="#" className="font-bold text-primary">
          Kebijakan Privasi
        </a>
        .
      </p>
    </form>
  );
}
