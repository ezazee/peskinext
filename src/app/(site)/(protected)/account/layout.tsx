
import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import AccountSidebar from "@features/account/AccountSidebar";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const profile = {
        name: user.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatarUrl: user.avatarUrl || "/images/avatar/default-avatar.jpg",
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
                {/* Sidebar only visible on desktop */}
                <div className="hidden md:block">
                    <AccountSidebar profile={profile} />
                </div>

                {/* Main Content */}
                <main className="min-h-[500px]">
                    {children}
                </main>
            </div>
        </div>
    );
}
