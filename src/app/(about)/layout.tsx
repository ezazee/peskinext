import type { Metadata } from "next";
import { Footer } from "@shared/components/layout/footer/DekstopFooter";
import { AboutHeader } from "@features/about/components/AboutHeader";
import RouteTransition from "@shared/components/transition/RouteTransition";
import { SessionTimeoutProvider } from "@shared/components/SessionTimeoutProvider";

export const metadata: Metadata = {
  title: "Tentang Kami | PE Skin Professional",
  description: "Pelajari lebih lanjut tentang PE Skin Professional, brand skincare yang menggunakan teknologi Jerman dan bahan natural vegan.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionTimeoutProvider />
      <AboutHeader />

      <RouteTransition>
        <div className="flex flex-col min-h-screen bg-white font-sans text-base-text selection:bg-primary/20">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </RouteTransition>
    </>
  );
}
