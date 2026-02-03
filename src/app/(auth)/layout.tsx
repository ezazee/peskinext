import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="w-full flex-grow flex flex-col items-center justify-center overflow-hidden">
        {children}
      </div>
      <footer className="w-full text-center py-4 text-sm text-gray-500 z-10 shrink-0 bg-transparent">
        ©{new Date().getFullYear()}, PT Kilau Berlian Nusantara
      </footer>
    </div>
  );
}
