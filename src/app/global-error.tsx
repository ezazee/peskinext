"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-4">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Terjadi Kesalahan Fatal
              </h2>
              <p className="text-gray-600 mb-6">
                Maaf, aplikasi mengalami kesalahan fatal. Silakan muat ulang halaman.
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={reset}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Muat Ulang Halaman
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
