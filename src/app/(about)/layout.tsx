
import { AboutHeader } from "@features/about/components/AboutHeader";
import { AboutFooter } from "@features/about/components/AboutFooter";

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Organization Schema specific for About page could be added here if customized

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-base-text">
            <AboutHeader />
            <main className="flex-grow">
                {children}
            </main>
            <AboutFooter />
        </div>
    );
}
