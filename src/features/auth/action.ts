"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateUser, registerUser, findUserById } from "@/data/users";
import crypto from "crypto";

// Types
export type LoginResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

export type RegisterResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

// Helper to generate session token
function generateSessionToken(userId: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString("hex");
  return `${userId}:${timestamp}:${random}`;
}

// Helper to parse session token
function parseSessionToken(token: string): { userId: string } | null {
  try {
    const parts = token.split(":");
    if (parts.length >= 3 && parts[0]) {
      return { userId: parts[0] };
    }
    return null;
  } catch {
    return null;
  }
}

// Get current user from session
export async function getCurrentUser() {
  try {
    const store = await cookies();
    const sessionToken = store.get("session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    const session = parseSessionToken(sessionToken);
    if (!session) {
      return null;
    }

    const user = findUserById(session.userId);
    if (!user) {
      return null;
    }

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Login action
export async function login(formData: FormData): Promise<LoginResult> {
  try {
    const emailOrPhone = formData.get("emailOrPhone") as string;
    const password = formData.get("password") as string;

    if (!emailOrPhone || !password) {
      return {
        success: false,
        error: "Email/HP dan password harus diisi",
      };
    }

    // Authenticate user
    const user = authenticateUser(emailOrPhone, password);

    if (!user) {
      return {
        success: false,
        error: "Email/HP atau password salah",
      };
    }

    // Create session
    const sessionToken = generateSessionToken(user.id);
    const store = await cookies();

    store.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      redirectTo: "/",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat login",
    };
  }
}

// Register action
export async function register(formData: FormData): Promise<RegisterResult> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    if (!email || !password || !name) {
      return {
        success: false,
        error: "Semua field harus diisi",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Format email tidak valid",
      };
    }

    // Validate password length
    if (password.length < 6) {
      return {
        success: false,
        error: "Password minimal 6 karakter",
      };
    }

    // Register user
    const result = registerUser({
      email,
      password,
      name,
      phone,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // Auto login after registration
    const sessionToken = generateSessionToken(result.user!.id);
    const store = await cookies();

    store.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      redirectTo: "/",
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat registrasi",
    };
  }
}

// Logout action
export async function logout() {
  try {
    const store = await cookies();

    // Delete session token cookie
    store.delete("session_token");

    // Redirect to home page
    redirect("/");
  } catch (error) {
    console.error("Error during logout:", error);
    // Even if there's an error, redirect to home
    redirect("/");
  }
}
