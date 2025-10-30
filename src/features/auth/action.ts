"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
