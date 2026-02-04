"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { XMarkIcon } from "@shared/components/icons";
import LoginFormWrapper from "./LoginFormWrapper";
import RegisterForm from "./RegisterForm";
import SocialLoginButtons from "./SocialLoginButtons";

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
            className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {view === "login" ? "Masuk" : "Daftar"}
                </h2>
                <button
                  type="button"
                  onClick={() => setView(view === "login" ? "register" : "login")}
                  className="font-bold text-primary hover:underline text-sm"
                >
                  {view === "login" ? "Daftar" : "Masuk"}
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 cursor-pointer hover:text-gray-800"
              >
                <XMarkIcon />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6">
              {view === "login" ? (
                <>
                  <LoginFormWrapper />
                  <SocialLoginButtons />
                </>
              ) : (
                <RegisterForm />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

