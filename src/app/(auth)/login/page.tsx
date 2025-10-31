// File: src/app/(auth)/login/page.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import LoginFormWrapper from '@/features/auth/components/LoginFormWrapper';

// --- Ikon-ikon untuk Opsi Login ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.39,44,30.134,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const QrCodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 15.75h4.5a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75v4.5a.75.75 0 00.75.75z" />
    </svg>
);

const TikTokIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.8-1.59-1.87-2.16-4.2-1.8-6.51.36-2.31 1.82-4.28 3.8-5.43 2.01-1.14 4.35-1.39 6.53-.75v4.44c-1.43-.48-2.93-.3-4.35.19-1.79.63-2.79 2.36-2.48 4.11.31 1.76 1.92 3.08 3.73 3.08 1.83 0 3.42-1.34 3.73-3.11.02-1.1.02-2.19.02-3.29s.01-2.19-.02-3.29c-.02-1.15-.43-2.29-1.23-3.11C15.13 5.43 13.83 5.2 12.525 5.2v-5.18z"></path>
    </svg>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);


const LoginPage = () => {
  return (
    <>
      {/* --- Tampilan Mobile --- */}
      <div className="md:hidden w-full h-screen bg-white flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-border-color shrink-0">
          <Link href="/" className="p-2">
            <ArrowLeftIcon />
          </Link>
          <h1 className="font-bold text-base-text">Masuk ke PE Skinpro</h1>
          <Link href="/register" className="font-bold text-primary text-sm">
            Daftar
          </Link>
        </header>
        <main className="flex-grow p-6 overflow-y-auto">
            <LoginFormWrapper />
            <div className="flex items-center my-6">
                <div className="flex-grow border-t border-border-color"></div>
                <span className="mx-4 text-xs text-subtle-text">atau masuk dengan</span>
                <div className="flex-grow border-t border-border-color"></div>
            </div>
            <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 border border-border-color font-semibold text-base-text py-3 rounded-lg hover:bg-tertiary transition-colors">
                    <QrCodeIcon />
                    Scan Kode QR
                </button>
                <button className="w-full flex items-center justify-center gap-3 border border-border-color font-semibold text-base-text py-3 rounded-lg hover:bg-tertiary transition-colors">
                    <GoogleIcon />
                    Google
                </button>
                <button className="w-full flex items-center justify-center gap-3 border border-border-color font-semibold text-base-text py-3 rounded-lg hover:bg-tertiary transition-colors">
                    <TikTokIcon />
                    Masuk dengan TikTok
                </button>
            </div>
        </main>
      </div>

      {/* --- Tampilan Desktop --- */}
      <div className="hidden md:block w-full max-w-md">
        <div className="fixed inset-0 z-[-1] overflow-hidden">
            <Image 
                src="/images/login.png" 
                alt="Background"
                layout="fill"
                objectFit="cover"
                quality={100}
            />
        </div>
        <div className="bg-white p-8 rounded-lg border border-border-color shadow-lg">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-base-text">Masuk ke PE Skinpro</h1>
              <Link href="/register" className="font-bold text-primary hover:underline text-sm">
                Daftar
              </Link>
            </div>
          </div>
          <div className="space-y-4">
              <LoginFormWrapper />
              <div className="flex items-center">
                  <div className="flex-grow border-t border-border-color"></div>
                  <span className="mx-4 text-xs text-subtle-text">atau masuk dengan</span>
                  <div className="flex-grow border-t border-border-color"></div>
              </div>
              <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-3 border border-border-color font-semibold text-base-text py-3 rounded-lg hover:bg-tertiary transition-colors">
                      <QrCodeIcon />
                      Scan Kode QR
                  </button>
                  <button className="w-full flex items-center justify-center gap-3 border border-border-color font-semibold text-base-text py-3 rounded-lg hover:bg-tertiary transition-colors">
                      <GoogleIcon />
                      Google
                  </button>
                  <button className="w-full flex items-center justify-center gap-3 border border-border-color font-semibold text-base-text py-3 rounded-lg hover:bg-tertiary transition-colors">
                      <TikTokIcon />
                      Masuk dengan TikTok
                  </button>
              </div>
          </div>
        </div>
         <footer className="text-center w-full text-sm text-subtle-text mt-8">
          © 2009-2025, PT PE Skinpro. <a href="#" className="font-bold text-primary hover:underline">Bantuan</a>
        </footer>
      </div>
    </>
  );
};

export default LoginPage;
