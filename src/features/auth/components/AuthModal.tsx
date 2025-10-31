// File: app/components/auth/AuthModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { QrCodeIcon, XMarkIcon } from "@shared/components/icons";
import { login } from "../action";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
  onLoginSuccess?: () => void;
}

export const AuthModal = ({
  isOpen,
  onClose,
  initialView = "login",
  onLoginSuccess,
}: AuthModalProps) => {
  const router = useRouter();
  const [view, setView] = useState(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setError(null);
    }
  }, [isOpen, initialView]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await login(formData);

      if (result.success) {
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        router.refresh();
      } else {
        setError(result.error || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-base-text">
                  {view === "login" ? "Masuk" : "Daftar"}
                </h2>
                {/* 2. Ganti <button> menjadi <Link> */}
                <Link
                  href={view === "login" ? "/register" : "/login"}
                  onClick={onClose}
                  className="font-bold text-primary hover:underline"
                >
                  {view === "login" ? "Daftar" : "Masuk"}
                </Link>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 cursor-pointer hover:text-gray-800"
              >
                <XMarkIcon />
              </button>
            </div>

            {/* Body Modal */}
            <div className="px-6 pb-6">
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
                  <a
                    href="#"
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Lupa kata sandi?
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

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
                  <p className="font-semibold mb-1">Demo Credentials:</p>
                  <p>Email: <code>user1@example.com</code></p>
                  <p>Password: <code>password123</code></p>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-border-color"></div>
                <span className="mx-4 text-sm text-subtle-text">
                  atau masuk dengan
                </span>
                <div className="flex-grow border-t border-border-color"></div>
              </div>

              {/* Opsi Login Lain */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 border border-border-color font-semibold text-base-text py-3 rounded-lg hover:bg-tertiary transition-colors">
                  <QrCodeIcon />
                  Scan Kode QR
                </button>
                <button className="w-full border border-border-color font-semibold text-base-text py-3 rounded-lg hover:bg-tertiary transition-colors">
                  Metode Lain
                </button>
              </div>

              {/* Footer Modal */}
              <div className="text-center mt-6 text-sm text-subtle-text">
                Butuh bantuan?{" "}
                <a href="#" className="font-bold text-primary hover:underline">
                  Hubungi Tokopedia Care
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
