import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://peskinpro.id"),

  title: "PE Skin Pro | Daftar",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {children}
    </div>
  );
}
