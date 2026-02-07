"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setSession } from "@/features/auth/action"; // Needed to set cookie from server side

function OAuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Force unregister any Service Workers (Zombie SW fix)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (const registration of registrations) {

                    registration.unregister();
                }
            });
        }

        const token = searchParams.get("token");
        const uid = searchParams.get("uid");
        const errorParam = searchParams.get("error");



        if (errorParam) {
            setError("Gagal memproses login Google.");
            setTimeout(() => router.push("/login"), 3000);
            return;
        }

        if (token && uid) {

            // Exchange token for session cookie via Server Action
            setSession(token, uid)
                .then(() => {

                    window.location.href = "/"; // Use window refresh to ensure cookies are picked up
                })
                .catch(() => {

                    setError("Failed to initialize session. Please try again.");
                });
        } else {

            setError("No token received.");
            setTimeout(() => router.push("/login"), 3000);
        }
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                <p className="text-gray-500">Authenticating...</p>
            </div>
        </div>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <OAuthCallbackContent />
        </Suspense>
    );
}
