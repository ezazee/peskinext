import { accountData } from "@data/account";
import AccountClient from "@features/account/AccountClient";

// SSR-safe, tidak ada any. Hanya pasang wrapper client.
export default function AccountPage() {
  return <AccountClient data={accountData} />;
}
