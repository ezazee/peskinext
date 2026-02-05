"use client";

import { useEffect, useState } from "react";
import AccountSidebar from "@features/account/AccountSidebar";
import AddressCreateClient from "@features/address/AddressCreateClient";
import { getCurrentUser } from "@features/auth/action";
import type { JSX } from "react";

export default function NewAddressClient(): JSX.Element {
  const [profile, setProfile] = useState({
    name: "Guest",
    email: "",
    avatarUrl: "/images/avatar/default-avatar.png",
  });

  useEffect(() => {
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
          />
        </div>
        <main className="bg-white rounded-xl border p-6">
          <AddressCreateClient />
        </main>
      </div>
    </div>
  );
}
