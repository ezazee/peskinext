import crypto from "crypto";

// Helper untuk generate stable ID dari email
function stableId(seed: string): string {
  return (
    "u_" + crypto.createHash("sha1").update(seed).digest("hex").slice(0, 10)
  );
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In real app, this would be hashed
  phone: string;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  plusMember: boolean;
  safeMode: boolean;
  birthDate?: string;
  createdAt: string;
}

// Data dummy users untuk simulasi
export const usersData: User[] = [
  {
    id: stableId("sosiotech123@gmail.com"),
    name: "Reza",
    email: "sosiotech123@gmail.com",
    password: "password123", // In production: hash this!
    phone: "6281313711180",
    avatarUrl: "https://placehold.co/600x400/2bc3ff/white?text=Reza",
    emailVerified: true,
    phoneVerified: true,
    plusMember: false,
    safeMode: false,
    birthDate: "2002-06-24",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: stableId("user1@example.com"),
    name: "Andi Pratama",
    email: "user1@example.com",
    password: "password123",
    phone: "6281234567890",
    avatarUrl: "https://placehold.co/600x400/f97316/white?text=Andi",
    emailVerified: true,
    phoneVerified: true,
    plusMember: true,
    safeMode: false,
    birthDate: "1995-03-10",
    createdAt: "2024-02-01T08:30:00Z",
  },
  {
    id: stableId("user2@example.com"),
    name: "Siti Nurhaliza",
    email: "user2@example.com",
    password: "password123",
    phone: "6281987654321",
    avatarUrl: "https://placehold.co/600x400/ec4899/white?text=Siti",
    emailVerified: true,
    phoneVerified: false,
    plusMember: false,
    safeMode: true,
    birthDate: "1998-07-22",
    createdAt: "2024-03-12T14:20:00Z",
  },
  {
    id: stableId("user3@example.com"),
    name: "Budi Santoso",
    email: "user3@example.com",
    password: "password123",
    phone: "6282123456789",
    avatarUrl: "https://placehold.co/600x400/10b981/white?text=Budi",
    emailVerified: false,
    phoneVerified: true,
    plusMember: false,
    safeMode: false,
    birthDate: "1992-11-05",
    createdAt: "2024-04-20T09:15:00Z",
  },
  {
    id: stableId("demo@peskinpro.com"),
    name: "Demo User",
    email: "demo@peskinpro.com",
    password: "demo123",
    phone: "6281111111111",
    avatarUrl: "https://placehold.co/600x400/8b5cf6/white?text=Demo",
    emailVerified: true,
    phoneVerified: true,
    plusMember: true,
    safeMode: false,
    birthDate: "1990-01-01",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// Helper functions untuk mencari user
export function findUserByEmail(email: string): User | undefined {
  return usersData.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserByPhone(phone: string): User | undefined {
  // Normalize phone number (remove +, spaces, dashes)
  const normalizedPhone = phone.replace(/[\s\-+]/g, "");
  return usersData.find((user) =>
    user.phone.replace(/[\s\-+]/g, "") === normalizedPhone
  );
}

export function findUserById(id: string): User | undefined {
  return usersData.find((user) => user.id === id);
}

export function authenticateUser(emailOrPhone: string, password: string): User | null {
  const user = findUserByEmail(emailOrPhone) || findUserByPhone(emailOrPhone);

  if (!user) {
    return null;
  }

  // In production, use proper password hashing comparison (bcrypt, etc.)
  if (user.password === password) {
    return user;
  }

  return null;
}

export function registerUser(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}): { success: boolean; user?: User; error?: string } {
  // Check if user already exists
  if (findUserByEmail(data.email)) {
    return {
      success: false,
      error: "Email sudah terdaftar",
    };
  }

  if (data.phone && findUserByPhone(data.phone)) {
    return {
      success: false,
      error: "Nomor HP sudah terdaftar",
    };
  }

  // Create new user
  const newUser: User = {
    id: stableId(data.email),
    name: data.name,
    email: data.email,
    password: data.password, // In production: hash this!
    phone: data.phone || "",
    emailVerified: false,
    phoneVerified: false,
    plusMember: false,
    safeMode: false,
    createdAt: new Date().toISOString(),
  };

  // In real app, this would be saved to database
  usersData.push(newUser);

  return {
    success: true,
    user: newUser,
  };
}
