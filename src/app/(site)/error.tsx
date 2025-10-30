"use client";

import { useEffect } from "react";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Site error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600">
            Mohon maaf, halaman ini mengalami kesalahan. Silakan coba lagi atau kembali ke beranda.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Coba Lagi
          </button>
          <a
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}
