"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@features/auth/action";

const FIVE_HOURS_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
const CHECK_INTERVAL = 60 * 1000; // Check every minute

/**
 * Hook untuk auto logout setelah 5 jam inactivity
 * Tracks user activity dan automatically logout jika tidak ada aktivitas
 *
 * @example
 * ```tsx
 * function App() {
 *   useSessionTimeout(); // Auto logout after 5 hours inactivity
 * }
 * ```
 */
export function useSessionTimeout() {
  const router = useRouter();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get last activity from cookie
  const getLastActivity = useCallback(() => {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    const lastActivityCookie = cookies.find(c => c.trim().startsWith("last_activity="));

    if (!lastActivityCookie) return null;

    const value = lastActivityCookie.split("=")[1];
    return value ? parseInt(value, 10) : null;
  }, []);

  // Update last activity in cookie
  const updateActivity = useCallback(() => {
    if (typeof document === "undefined") return;

    const now = Date.now();
    const fiveHoursInSeconds = 60 * 60 * 5;

    // Update cookie
    document.cookie = `last_activity=${now}; path=/; max-age=${fiveHoursInSeconds}; SameSite=Lax`;
  }, []);

  // Check if session has expired
  const checkSessionExpiry = useCallback(async () => {
    const lastActivity = getLastActivity();

    if (!lastActivity) {
      // No last activity means not logged in
      return;
    }

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;

    if (timeSinceLastActivity > FIVE_HOURS_MS) {
      // Session expired, logout
      console.log("Session expired due to inactivity");

      // Clear interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }

      // Logout
      await logout();

      // Redirect to login
      router.push("/login?reason=session-expired");
    }
  }, [getLastActivity, router]);

  // Handle user activity
  const handleActivity = useCallback(() => {
    updateActivity();

    // Clear existing timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    // Set new timeout for auto logout
    activityTimeoutRef.current = setTimeout(async () => {
      console.log("Auto logout due to 5 hours inactivity");
      await logout();
      router.push("/login?reason=session-expired");
    }, FIVE_HOURS_MS);
  }, [updateActivity, router]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Check if user is logged in
    const lastActivity = getLastActivity();
    if (!lastActivity) return;

    // Initial activity update
    handleActivity();

    // Check session expiry periodically
    checkIntervalRef.current = setInterval(checkSessionExpiry, CHECK_INTERVAL);

    // Track user activity
    const events = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }

      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [getLastActivity, handleActivity, checkSessionExpiry]);
}
