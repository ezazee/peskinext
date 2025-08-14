// File: src/app/(auth)/register/page.tsx
"use client";

import { ArrowLeftIcon, GoogleIcon } from "@shared/components/icons";
import Image from "next/image";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <>
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
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label
                htmlFor="mobile-email"
                className="block text-sm font-medium text-subtle-text mb-1"
              >
                Nomor HP atau E-mail
              </label>
              <input
                type="email"
                id="mobile-email"
                placeholder="Contoh: email@tokopedia.com"
                className="w-full border border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Daftar
            </button>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-border-color"></div>
            <span className="mx-4 text-xs text-subtle-text">atau</span>
            <div className="flex-grow border-t border-border-color"></div>
          </div>
          <button className="w-full flex items-center justify-center gap-3 border border-border-color font-semibold text-base-text py-3 rounded-lg hover:bg-tertiary transition-colors">
            <GoogleIcon />
            Google
          </button>
          <p className="text-center text-xs text-subtle-text mt-6">
            Dengan mendaftar, saya menyetujui <br />
            <a href="#" className="font-bold text-primary">
              Syarat & Ketentuan
            </a>{" "}
            serta{" "}
            <a href="#" className="font-bold text-primary">
              Kebijakan Privasi
            </a>
            .
          </p>
        </main>
      </div>

      {/* --- Tampilan Desktop --- */}
      <div className="hidden md:flex w-full max-w-5xl items-center justify-center">
        {/* Kolom Kiri - Ilustrasi */}
        <div className="w-1/2 flex flex-col items-center text-center p-8">
          <Image
            src="https://placehold.co/400x300/E8F5FA/1D9AD2?text=Ilustrasi+Toko"
            alt="Ilustrasi Toko"
            width={400}
            height={300}
          />
          <h2 className="text-2xl font-bold text-base-text mt-6">
            Jual Beli Mudah Hanya di PE Skinpro
          </h2>
          <p className="text-subtle-text mt-2">
            Gabung dan rasakan kemudahan bertransaksi di PE Skinpro
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
              <button className="w-full flex items-center justify-center gap-3 border border-border-color font-semibold text-base-text py-3 rounded-lg hover:bg-tertiary transition-colors">
                <GoogleIcon />
                Google
              </button>
              <div className="flex items-center">
                <div className="flex-grow border-t border-border-color"></div>
                <span className="mx-4 text-xs text-subtle-text">atau</span>
                <div className="flex-grow border-t border-border-color"></div>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Nomor HP atau E-mail"
                  className="w-full border border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-subtle-text mt-2 mb-4">
                  Contoh: email@tokopedia.com
                </p>
                <button
                  type="submit"
                  className="w-full bg-gray-200 text-gray-400 font-bold py-3 rounded-lg cursor-not-allowed"
                >
                  Daftar
                </button>
              </form>
              <p className="text-center text-xs text-subtle-text pt-2">
                Dengan mendaftar, saya menyetujui <br />
                <a href="#" className="font-bold text-primary">
                  Syarat & Ketentuan
                </a>{" "}
                serta{" "}
                <a href="#" className="font-bold text-primary">
                  Kebijakan Privasi
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="hidden md:block absolute bottom-4 text-center w-full text-sm text-subtle-text">
        © 2009-2025, PT PE Skinpro.{" "}
        <a href="#" className="font-bold text-primary hover:underline">
          PE Skinpro Care
        </a>
      </footer>
    </>
  );
};

export default RegisterPage;
