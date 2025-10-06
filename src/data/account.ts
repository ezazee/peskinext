import crypto from "crypto";
// bikin id stabil dari email (atau kombinasi data lain)
function stableId(seed: string): string {
  return (
    "u_" + crypto.createHash("sha1").update(seed).digest("hex").slice(0, 10)
  );
}

const profile = {
  id: stableId("sosiotech123@gmail.com"),
  name: "Reza",
  avatarUrl: "https://placehold.co/600x400/2bc3ff/white?text=Reza",
  email: "sosiotech123@gmail.com",
  phone: "6281313711180",
  emailVerified: true,
  phoneVerified: true,
  plusMember: false,
  safeMode: false,
  birthDate: "2002-06-24",
};

export const accountData = {
  profile,
} as const;
