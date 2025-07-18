"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCodeIcon, XMarkIcon } from "../icons";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

export const AuthModal = ({
  isOpen,
  onClose,
  initialView = "login",
}: AuthModalProps) => {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

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
                <button
                  onClick={() =>
                    setView(view === "login" ? "register" : "login")
                  }
                  className="font-bold text-primary hover:underline"
                >
                  {view === "login" ? "Daftar" : "Masuk"}
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-800"
              >
                <XMarkIcon />
              </button>
            </div>

            {/* Body Modal */}
            <div className="px-6 pb-6">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-subtle-text mb-1"
                  >
                    Nomor HP atau Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full bg-gray-200 text-gray-400 font-bold py-3 rounded-lg cursor-not-allowed"
                >
                  Selanjutnya
                </button>
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
