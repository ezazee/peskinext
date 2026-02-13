"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "success" | "warning";
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Ya, Konfirmasi",
    cancelLabel = "Batal",
    variant = "success",
    isLoading = false,
}: ConfirmationModalProps) {
    // Prevent scrolling when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            disabled={isLoading}
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6 sm:p-8 text-center">
                            {/* Icon Container */}
                            <div
                                className={`mx-auto w-16 h-16 flex items-center justify-center rounded-2xl mb-6 shadow-lg ${variant === "success"
                                    ? "bg-emerald-50 text-emerald-500 shadow-emerald-100"
                                    : "bg-amber-50 text-amber-500 shadow-amber-100"
                                    }`}
                            >
                                {variant === "success" ? (
                                    <CheckCircle2 size={36} strokeWidth={1.5} />
                                ) : (
                                    <AlertCircle size={36} strokeWidth={1.5} />
                                )}
                            </div>

                            {/* Text */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                {description}
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${variant === "success"
                                        ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                                        : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
                                        }`}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        confirmLabel
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all active:scale-[0.98]"
                                >
                                    {cancelLabel}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
