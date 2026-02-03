"use server";

import { cookies } from "next/headers";
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
function parseSessionToken(token: string): { userId: string; accessToken: string } | null {
  try {
    const parts = token.split(":");
    if (parts.length >= 3 && parts[0]) {
      // Reconstruct token if it had colons? No, we assume token is the 3rd part to the end
      // But we just did `${uid}:${timestamp}:${token}`
      // If token itself has colons, this split might break.
      // JWTs usually don't.
      // But to be safe, let's join the rest.
      const accessToken = parts.slice(2).join(":");
      return { userId: parts[0], accessToken };
    }
    return null;
  } catch {
    return null;
  }
}

// === API HELPERS ===
const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

async function fetchUserById(id: string, token: string) {
  try {
    // console.log("DEBUG: fetchUserById - Fetching:", `${API_URL}/api/v1/user/me`);
    const res = await fetch(`${API_URL}/api/v1/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("DEBUG: fetchUserById - Error Response:", res.status, text);
      console.error("DEBUG: fetchUserById - Failed URL:", `${API_URL}/api/v1/user/me`);
      return null;
    }
    const data = await res.json();
    // console.log("DEBUG: fetchUserById - Success:", data);
    return data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function apiLogin(emailOrPhone: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailOrPhone, password }),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Login failed");
    }

    const data = await res.json();
    return { ...data.user, token: data.token };
  } catch (error) {
    console.error("API Login Error:", error);
    return null;
  }
}

async function apiRegister(data: Record<string, unknown>): Promise<{ success: boolean; user?: Record<string, unknown>; error?: string }> {
  try {
    // console.log("DEBUG: Registering with data:", data);
    const res = await fetch(`${API_URL}/api/v1/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || "Registrasi gagal" };
    }

    const result = await res.json();
    return { success: true, user: result.user };
  } catch (e) {
    console.error("Register Error:", e);
    return { success: false, error: "Gagal menghubungkan ke server" };
  }
}


// Get current user from session
export async function getCurrentUser() {
  try {
    const store = await cookies();
    const sessionToken = store.get("session_token")?.value;

    // console.log("DEBUG: getCurrentUser - Raw Token:", sessionToken);

    if (!sessionToken) {
      // console.log("DEBUG: getCurrentUser - No token in cookies");
      return null;
    }

    const session = parseSessionToken(sessionToken);
    if (!session) {
      console.error("DEBUG: getCurrentUser - Failed to parse token:", sessionToken);
      return null;
    }

    // console.log("DEBUG: getCurrentUser - Parsed Session:", { userId: session.userId, hasToken: !!session.accessToken });

    const user = await fetchUserById(session.userId, session.accessToken);
    if (!user) {
      console.error("DEBUG: getCurrentUser - Fetch returned null");
      return null;
    }

    // console.log("DEBUG: getCurrentUser - User Fetched:", user.id);

    // Return user (backend already filters password usually, but safe to destructure)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    console.log("DEBUG: getCurrentUser - Raw images from backend:", user.images);
    console.log("DEBUG: getCurrentUser - Mapped Data:", { ...userWithoutPassword, avatarUrl: user.images });

    // Ensure avatarUrl exists (backend might just return 'avatar')
    return {
      ...userWithoutPassword,
      avatarUrl: user.images || "/images/avatar/default-avatar.jpg",
      id: user.id || session.userId // Fallback
    };
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
    const callbackUrl = formData.get("callbackUrl") as string | null;

    if (!emailOrPhone || !password) {
      return {
        success: false,
        error: "Email/HP dan password harus diisi",
      };
    }

    // Authenticate user
    const user = await apiLogin(emailOrPhone, password);

    if (!user) {
      return {
        success: false,
        error: "Email/HP atau password salah",
      };
    }

    // Create session with 5 hour expiry
    // Use the actual token from backend instead of random bytes
    const timestamp = Date.now();
    const sessionToken = `${user.id}:${timestamp}:${user.token}`;

    // const sessionToken = generateSessionToken(user.id); // DEPRECATED
    const store = await cookies();
    const FIVE_HOURS = 60 * 60 * 5; // 5 hours in seconds

    store.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: FIVE_HOURS,
      path: "/",
    });

    // Set last activity timestamp
    store.set("last_activity", Date.now().toString(), {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: FIVE_HOURS,
      path: "/",
    });

    return {
      success: true,
      redirectTo: callbackUrl || "/",
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
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;

    if (!email || !password || !firstName || !lastName || !phone) {
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
    // Mapping to backend expectation: name = firstName + " " + lastName
    // OR passing individually if backend supports it.
    // For now, based on UserModel having first_name/last_name, we pass them.
    const result = await apiRegister({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`, // Fallback for 'name' field
      phone,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Gagal registrasi",
      };
    }

    // Auto login after registration with 5 hour expiry
    const userId = String(result.user?.id ?? "");
    // NOTE: apiRegister currently is a STUB so it doesn't return a token.
    // Real flow should return a token upon register or require explicit login.
    // For now, let's assume we redirect to login or handle it.
    // If we want auto-login, we need a token.
    // As a temporary fix for manual register, we can't fully auto-login without a token from backend.
    // So for now, we will just redirect to login page (or return success and let UI handle it).

    // For now, assuming manual register doesn't auto-login unless we call login API.
    // Ideally we should call apiLogin here.

    // Let's defer auto-login for manual register until we have real register API.
    // But to prevent "broken" feel, let's try to login automatically.
    const loginRes = await apiLogin(email, password);
    if (loginRes) {
      const timestamp = Date.now();
      const sessionToken = `${loginRes.id}:${timestamp}:${loginRes.token}`;
      const store = await cookies();
      const FIVE_HOURS = 60 * 60 * 5;

      store.set("session_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: FIVE_HOURS,
        path: "/",
      });

      store.set("last_activity", Date.now().toString(), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: FIVE_HOURS,
        path: "/",
      });
    }

    return {
      success: true,
      redirectTo: "/", // Or /login if auto-login failed
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
export async function logout(): Promise<{ success: boolean }> {
  try {
    const store = await cookies();

    // Delete session token cookie
    store.delete("session_token");
    // Delete last activity cookie
    store.delete("last_activity");

    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);
    return { success: false };
  }
}

// Update last activity timestamp
export async function updateLastActivity(): Promise<void> {
  try {
    const store = await cookies();
    const sessionToken = store.get("session_token");

    if (sessionToken) {
      const FIVE_HOURS = 60 * 60 * 5;
      store.set("last_activity", Date.now().toString(), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: FIVE_HOURS,
        path: "/",
      });
    }
  } catch (error) {
    console.error("Error updating last activity:", error);
  }
}

// Helper to set session from OAuth
// Helper to set session from OAuth
export async function setSession(token: string, uid: string): Promise<void> {
  const store = await cookies();
  const FIVE_HOURS = 60 * 60 * 5;

  // Format session token to match what verifySessionToken expects:
  // userId:timestamp:random(or token)
  const timestamp = Date.now();
  // Ensure token doesn't contain colons or replace them, though JWT usually doesn't have colons.
  // Actually, let's just use the token as the 3rd part. 
  // If the token is too long or causes issues, we might just store a hash or similar, 
  // but for now let's match the format.
  const sessionToken = `${uid}:${timestamp}:${token}`;

  store.set("session_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: FIVE_HOURS,
    path: "/",
  });

  // Set activity
  store.set("last_activity", Date.now().toString(), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: FIVE_HOURS,
    path: "/",
  });
}
