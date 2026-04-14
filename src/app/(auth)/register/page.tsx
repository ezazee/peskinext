// File: src/app/(auth)/register/page.tsx
"use client";

import { ArrowLeftIcon } from "@shared/components/icons";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { useSettings } from "@features/settings/useSettings";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

const RegisterPage = () => {
  const { data: settings } = useSettings();
  const bgImage = normalizeImageUrl(settings?.auth_bg_url) || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop";

  return (
    <>
      {/* ... (mobile part remains unchanged) ... */}
      {/* --- Tampilan Mobile --- */}
      <div className="md:hidden w-full h-screen bg-white flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-border-color">
          <Link href="/" className="p-2">
            <ArrowLeftIcon />
          </Link>
          <h1 className="font-bold text-base-text">Daftar ke PE Skinpro</h1>
          <Link href="/login" className="font-bold text-primary text-sm">
            Masuk
          </Link>
        </header>
        <main className="flex-grow p-4">
          <RegisterForm />
        </main>
      </div>

      {/* --- Tampilan Desktop --- */}
      <div className="hidden md:flex w-full max-w-5xl items-center justify-center">
        {/* Kolom Kiri - Ilustrasi Dinamis */}
        <div className="w-1/2 flex flex-col items-center text-center p-8">
          <Image
            src={bgImage}
            alt="PE Skinpro ID"
            width={400}
            height={300}
            className="object-contain"
          />
          <h2 className="text-2xl font-bold text-base-text mt-6">
            Your Daily Skin Routine
          </h2>
          <p className="text-subtle-text mt-2">
            Simple, aman, dan mudah untuk digunakan
          </p>
        </div>

        {/* Kolom Kanan - Form */}
        <div className="w-1/2 max-w-md">
          <div className="bg-white p-8 rounded-lg border border-border-color shadow-md">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-base-text">
                Daftar Sekarang
              </h1>
              <p className="text-sm text-subtle-text mt-1">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:underline"
                >
                  Masuk
                </Link>
              </p>
            </div>
            <div className="space-y-4">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
