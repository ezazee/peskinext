"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { resetPasswordAction } from "@/features/auth/action";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Token tidak valid atau tidak ditemukan.");
        }
    }, [token]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!token) return;

        setIsLoading(true);
        setMessage(null);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await resetPasswordAction(token, formData);
            if (result.success) {
                setMessage(result.message || "Password berhasil direset!");
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                setError(result.error || "Gagal mereset password");
            }
        } catch (_err) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center z-10">
                    <h1 className="text-xl font-bold text-red-600 mb-2">Link Tidak Valid</h1>
                    <p className="text-gray-500 mb-6">Link reset password tidak valid atau sudah kadaluarsa.</p>
                    <Link href="/forgot-password" className="text-primary font-semibold hover:underline">
                        Minta Link Baru
                    </Link>
                </div>
            </div>
        );
    }

    const Content = () => (
        <div className="w-full h-full md:h-auto bg-white p-8 md:rounded-lg md:border md:border-gray-200 md:shadow-xl relative hidden-scrollbar md:block">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                <p className="text-gray-500 text-sm">
                    Masukkan password baru Anda.
                </p>
            </div>

            {message ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 text-center">
                    <p className="font-medium">{message}</p>
                    <p className="text-sm mt-2">Mengalihkan ke halaman login...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Password Baru
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Minimal 6 karakter"
                                required
                                minLength={6}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
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

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Konfirmasi Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Ulangi password"
                                required
                                minLength={6}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-bold py-3 rounded-lg shadow-md transition-all ${isLoading
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary/90 active:scale-[0.99]"
                            }`}
                    >
                        {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
                    </button>
                </form>
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
                    <h1 className="font-bold text-gray-900 text-lg">Reset Password</h1>
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
