// File: src/app/(auth)/login/page.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import LoginFormWrapper from '@/features/auth/components/LoginFormWrapper';
import SocialLoginButtons from '@/features/auth/components/SocialLoginButtons';
import { useSettings } from "@features/settings/useSettings";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const LoginPage = () => {
  return (
    <>
      {/* --- Tampilan Mobile --- */}
      <div className="md:hidden w-full h-full bg-white flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <Link href="/" className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full">
            <ArrowLeftIcon />
          </Link>
          <h1 className="font-bold text-gray-900 text-lg">Masuk</h1>
          <Link href="/register" className="font-bold text-primary text-sm hover:underline">
            Daftar
          </Link>
        </header>
        <main className="flex-grow p-6 overflow-y-auto scrollbar-hide">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang!</h2>
            <p className="text-gray-500 text-sm">Masuk untuk mulai berbelanja dan nikmati promo menarik.</p>
          </div>

          <LoginFormWrapper />

          <SocialLoginButtons />
        </main>
      </div>

      {/* --- Tampilan Desktop --- */}
      <div className="hidden md:flex w-full h-full items-center justify-center relative bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-200 shadow-xl z-10 mx-4">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Masuk ke PE Skinpro</h1>
              <Link href="/register" className="font-bold text-primary hover:underline text-sm">
                Daftar
              </Link>
            </div>
          </div>

          <LoginFormWrapper />

          <SocialLoginButtons />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
