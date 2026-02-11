
"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface PaymentTimerProps {
    expiresAt: string;
    className?: string;
    compact?: boolean;
}

export function PaymentTimer({ expiresAt, className = "", compact = false }: PaymentTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const expirationDate = new Date(expiresAt).getTime();
            const difference = expirationDate - now;

            // Debug log
            if (process.env.NODE_ENV === "development") {
                console.log("PaymentTimer Debug:", { expiresAt, now, expirationDate, difference });
            }

            if (difference <= 0) {
                setTimeLeft(null);
                setIsExpired(true);
                return;
            }

            const hours = Math.floor((difference / (1000 * 60 * 60)));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
            setIsExpired(false);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    if (isExpired) {
        return (
            <div className={`text-red-600 font-medium flex items-center gap-1.5 ${className}`}>
                <Clock className={compact ? "w-3 h-3" : "w-4 h-4"} />
                <span className={compact ? "text-xs" : "text-sm"}>Waktu Habis</span>
            </div>
        );
    }

    if (!timeLeft) return null;

    return (
        <div className={`text-orange-600 font-medium flex items-center gap-1.5 ${className}`}>
            <Clock className={compact ? "w-3 h-3" : "w-4 h-4"} />
            <span className={compact ? "text-xs" : "text-sm"}>
                {compact ? "" : "Bayar dalam "}
                {timeLeft.hours.toString().padStart(2, '0')}:
                {timeLeft.minutes.toString().padStart(2, '0')}:
                {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
        </div>
    );
}
