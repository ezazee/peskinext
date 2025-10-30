"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../action";

export default function RegisterForm() {
  const router = useRouter();
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
        router.push(result.redirectTo || "/");
        router.refresh();
      } else {
        setError(result.error || "Registrasi gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat registrasi");
      console.error("Register error:", err);
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
        className={`w-full font-bold py-3 rounded-lg transition-colors ${
          isLoading
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
