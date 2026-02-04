"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "../action";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    // Validasi Input Client-Side
    const input = formData.get("emailOrPhone") as string;

    // Regex Email Strict (General standard: username@domain.extension)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Regex Phone (Angka saja, minimal 10 digit, maksimal 14)
    const phoneRegex = /^[0-9]{10,14}$/;

    if (input.includes("@")) {
      // Validasi Email
      if (!emailRegex.test(input)) {
        setError("Format email tidak valid. Gunakan email yang benar (contoh: user@gmail.com)");
        setIsLoading(false);
        return;
      }
    } else {
      // Validasi Nomor HP
      // Hapus karakter non-digit jika user memasukkan spasi/dash
      const cleanPhone = input.replace(/\D/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        setError("Nomor HP tidak valid. Masukkan 10-14 digit angka.");
        setIsLoading(false);
        return;
      }
    }

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
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="emailOrPhone"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Nomor HP atau Email
        </label>
        <input
          type="text"
          id="emailOrPhone"
          name="emailOrPhone"
          placeholder="Contoh: user1@example.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Masukkan password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="text-right">
        <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          Lupa password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full font-bold py-3 rounded-lg cursor-pointer shadow-md transition-all ${isLoading
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg active:scale-[0.99]"
          }`}
      >
        {isLoading ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
