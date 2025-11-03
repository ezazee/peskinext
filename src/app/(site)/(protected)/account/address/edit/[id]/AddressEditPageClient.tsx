"use client";

import * as React from "react";
import AccountSidebar from "@features/account/AccountSidebar";
import AddressEditClient from "@features/address/AddressEditClient";
import { getCurrentUser } from "@features/auth/action";

export default function AddressEditPageClient({
  params,
}: {
  params: Promise<{ id: string }>;
}): React.JSX.Element {
  const { id } = React.use(params);

  const [profile, setProfile] = React.useState({
    name: "Guest",
    email: "",
    avatarUrl: "/images/avatar/default-avatar.png",
  });

  React.useEffect(() => {
    async function loadProfile() {
      const user = await getCurrentUser();
      if (user) {
        setProfile({
          name: user.name,
          email: user.email || "",
          avatarUrl: "/images/avatar/default-avatar.png",
        });
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="container mx-auto px-3 md:px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 md:gap-6 items-start">
        <div className="hidden md:block">
          <AccountSidebar
          profile={{
            name: profile.name,
            email: profile.email,
            avatarUrl: profile.avatarUrl,
          }}
          active="address"
          onLogout={() => alert("Logout belum diimplementasi (mock).")}
        />
        </div>

        <main className="bg-white rounded-xl border p-6">
          <AddressEditClient id={id} />
        </main>
      </div>
    </div>
  );
}
