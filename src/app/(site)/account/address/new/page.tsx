"use client";

import AccountSidebar from "@features/account/AccountSidebar";
import AddressCreateClient from "@features/address/AddressCreateClient";
import { accountData } from "@data/account";
import type { JSX } from "react";

export default function AddressCreatePage(): JSX.Element {
  const { profile } = accountData;

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
          <AddressCreateClient />
        </main>
      </div>
    </div>
  );
}
