// src/shared/components/ui/ProgressStepper.tsx
"use client";

import React from "react";
import { CheckIcon } from "@heroicons/react/20/solid";

export type CheckoutStep = "address" | "shipping" | "voucher" | "payment";

const STEPS: { id: CheckoutStep; label: string }[] = [
    { id: "address", label: "Alamat" },
    { id: "shipping", label: "Pengiriman" },
    { id: "voucher", label: "Voucher" },
    { id: "payment", label: "Pembayaran" },
];

interface ProgressStepperProps {
    currentStep: CheckoutStep;
    className?: string;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
    currentStep,
    className = "",
}) => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

    return (
        <div className={`w-full py-4 ${className}`}>
            <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

                {/* Active Line */}
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
                    style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step, idx) => {
                    const isCompleted = idx < currentIndex;
                    const isActive = idx === currentIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${isCompleted
                                        ? "bg-primary border-primary"
                                        : isActive
                                            ? "bg-white border-primary shadow-lg shadow-primary/20 scale-110"
                                            : "bg-white border-gray-200"
                                    }`}
                            >
                                {isCompleted ? (
                                    <CheckIcon className="h-5 w-5 text-white" />
                                ) : (
                                    <span
                                        className={`text-xs font-bold ${isActive ? "text-primary" : "text-gray-400"
                                            }`}
                                    >
                                        {idx + 1}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`absolute -bottom-6 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? "text-primary" : "text-gray-400"
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
