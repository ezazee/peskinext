"use client";

import { useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "@features/auth/action";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

/**
 * Hook untuk mengecek status authentication user
 *
 * @example
 * ```tsx
 * const { isLoggedIn, user, checkAuth } = useAuth();
 *
 * if (!isLoggedIn) {
 *   return <LoginPrompt />;
 * }
 * ```
 */
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setIsLoggedIn(!!currentUser);
      setUser(currentUser as User | null);
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isLoggedIn,
    user,
    loading,
    checkAuth,
  };
}

/**
 * Hook untuk mengecek apakah suatu route memerlukan authentication
 *
 * @example
 * ```tsx
 * const { isProtectedRoute } = useProtectedRoute();
 *
 * if (isProtectedRoute('/account')) {
 *   // Show login modal
 * }
 * ```
 */
const PROTECTED_ROUTES = [
  "/account",
  "/account/transaction",
  "/cart",
  "/notification",
  "/checkout",
];

export function useProtectedRoute() {
  const isProtectedRoute = useCallback((path: string) => {
    return PROTECTED_ROUTES.some(route =>
      path === route || path.startsWith(route + "/")
    );
  }, []);

  return {
    isProtectedRoute,
    PROTECTED_ROUTES,
  };
}
