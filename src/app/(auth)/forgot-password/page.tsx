"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { forgotPasswordAction } from "@/features/auth/action";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await forgotPasswordAction(formData);
            if (result.success) {
                setMessage(result.message || "Email reset password telah dikirim");
            } else {
                setError(result.error || "Gagal mengirim email");
            }
        } catch (_err) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    }

    const Content = () => (
        <div className="w-full h-full md:h-auto bg-white p-8 md:rounded-lg md:border md:border-gray-200 md:shadow-xl relative">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password?</h1>
                <p className="text-gray-500 text-sm">
                    Masukkan email Anda, kami akan mengirimkan link untuk mereset password.
                </p>
            </div>

            {message ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 text-center">
                    <p className="font-medium">{message}</p>
                    <p className="text-sm mt-2">Silakan cek inbox atau folder spam Anda.</p>
                    <Link href="/login" className="block mt-4 text-primary font-semibold hover:underline">
                        Kembali ke Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="email@example.com"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-bold py-3 rounded-lg shadow-md transition-all ${isLoading
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary/90 active:scale-[0.99]"
                            }`}
                    >
                        {isLoading ? "Mengirim..." : "Kirim Link Reset"}
                    </button>
                </form>
            )}

            {!message && (
                <div className="text-center mt-6">
                    <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                        Kembali ke Login
                    </Link>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile View */}
            <div className="md:hidden min-h-screen bg-white">
                <header className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <Link href="/login" className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                    <h1 className="font-bold text-gray-900 text-lg">Lupa Password</h1>
                    <div className="w-9" /> {/* Spacer */}
                </header>
                <div className="p-4 pt-10">
                    <Content />
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex w-full min-h-screen items-center justify-center relative bg-gray-50">
                <div className="w-full max-w-md z-10 mx-4">
                    <Content />
                </div>
            </div>
        </>
    );
}
