"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  BellIcon,
  CartIcon,
  ChevronDownIcon,
  LocationIcon,
  SearchIcon,
  TagIcon,
} from "@shared/components/icons";
import { AuthModal } from "@features/auth/components/AuthModal";
import { AddressModal } from "@shared/components/ui/AddressModal";
import { AuthAction } from "@features/auth/AuthAction";
import { logout, getCurrentUser } from "@features/auth/action";
import { getAddresses } from "@features/address/action";
import type { AddressItem } from "@shared/types/types";
import type { AddressListEntry } from "@shared/types/types";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import {
  startAddressSwitch,
  useAddressSwitching,
} from "@features/address/addressSwitchBus";
import { searchProducts } from "@features/search/searchService";
import type { Product } from "@shared/types/types";
import { useToast } from "@shared/components/ui/Toaster";
import { getCartItemCount, setCurrentUserId as setCartUserId } from "@features/cart/cartService";
import { Avatar } from "@shared/components/ui/Avatar";

type OptionForModal = AddressListEntry & {
  recipient?: string;
  phone?: string;
  pinpointed?: boolean;
};

function MenuItem({
  href,
  label,
  onDone,
  asButton = false,
  danger = false,
}: {
  href?: string;
  label: string;
  onDone?: () => void;
  asButton?: boolean;
  danger?: boolean;
}) {
  const content = (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-colors ${danger
        ? "text-red-600 hover:bg-red-50 active:bg-red-100 font-medium"
        : "text-gray-800 hover:bg-gray-50 active:bg-gray-100"
        }`}
    >
      <span className="text-sm">{label}</span>
      {!danger && (
        <ChevronDownIcon className="h-3.5 w-3.5 rotate-[-90deg] text-gray-400" />
      )}
    </div>
  );

  if (asButton) return content;

  return (
    <Link href={href ?? "#"} role="menuitem" onClick={onDone} className="block">
      {content}
    </Link>
  );
}

export const DesktopHeader = () => {
  const switching = useAddressSwitching();
  const router = useRouter();
  const toast = useToast();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [isLoading] = useState(false);

  // Check login status dynamically
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
  } | null>(null);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    const userId = user?.id || null;
    setIsLoggedIn(!!user);
    setCurrentUserId(userId);

    // Set user profile data
    if (user) {
      setUserProfile({
        id: user.id,
        name: user.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        phone: user.phone || "",
        avatarUrl: user.avatarUrl || "/images/avatar/default-avatar.jpg",
      });
    } else {
      setUserProfile(null);
    }

    // Set user ID for cart service
    setCartUserId(userId);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const updateCount = () => {
      setCartCount(getCartItemCount(currentUserId));
    };

    updateCount();
    window.addEventListener('cartUpdated', updateCount);

    // Listen for profile updates (e.g. from Edit Profile page)
    const handleProfileUpdate = () => checkAuth();
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('cartUpdated', updateCount);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [currentUserId]);

  // Callback after successful login
  const handleLoginSuccess = () => {
    checkAuth();
  };

  // Search suggestions effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchProducts(searchQuery)
          .then((result) => {
            if (result && Array.isArray(result.products)) {
              setSearchSuggestions(result.products.slice(0, 5));
            } else {
              setSearchSuggestions([]);
            }
          })
          .catch(() => setSearchSuggestions([]));
      } else {
        setSearchSuggestions([]);
      }
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authModalView, setAuthModalView] = useState<"login" | "register">(
    "login"
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Hydration guard
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // >>> User profile dari session (bukan mock data)
  const user = userProfile || {
    id: "",
    name: "Guest",
    email: "",
    phone: "",
    avatarUrl: "/images/avatar/default-avatar.png",
  };

  // Address state
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [primaryAddress, setPrimaryAddress] = useState<AddressItem | null>(null);

  // Fetch addresses from API
  const fetchAddresses = async () => {
    const result = await getAddresses();
    if (result.success && result.data) {
      setAddresses(result.data);
      const primary = result.data.find(a => a.isPrimary);
      setPrimaryAddress(primary || result.data[0] || null);
    }
  };

  // Load addresses on mount and when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchAddresses();
    }
  }, [isLoggedIn]);

  // Listen for address updates
  useEffect(() => {
    const handleAddressUpdate = () => {
      if (isLoggedIn) {
        fetchAddresses();
      }
    };
    window.addEventListener('addressUpdated', handleAddressUpdate);
    return () => window.removeEventListener('addressUpdated', handleAddressUpdate);
  }, [isLoggedIn]);

  // Sync primary address to localStorage for other components (e.g. shipping calculator)
  // Sync primary address to localStorage for other components (e.g. shipping calculator)
  useEffect(() => {
    if (primaryAddress) {
      const dest = `${primaryAddress.city}, ${primaryAddress.postalCode} `;
      localStorage.setItem("defaultDestination", dest);
    }
  }, [primaryAddress]);

  // Label header: samakan dengan AddressCard (Label • Penerima)
  const label = useMemo(() => {
    if (!hydrated || !primaryAddress) return "Pilih alamat";
    const who = primaryAddress.recipient ? ` • ${primaryAddress.recipient} ` : "";
    return `${primaryAddress.label}${who} `;
  }, [hydrated, primaryAddress]);

  // Opsi untuk modal (urutkan primary di atas)
  const options = useMemo<ReadonlyArray<OptionForModal>>(() => {
    const list = addresses.map<OptionForModal>((a) => ({
      id: a.id,
      label: a.label,
      address: `${a.line1}, ${a.city}, ${a.province} ${a.postalCode}`,
      isPrimary: primaryAddress ? a.id === primaryAddress.id : a.isPrimary,
      recipient: a.recipient,
      phone: a.phone,
      pinpointed: true,
    }));
    return [...list].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  }, [addresses, primaryAddress]);

  // tutup overlay search saat klik luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const openAuthModal = (view: "login" | "register") => {
  //   setAuthModalView(view);
  //   setIsAuthModalOpen(true);
  // };

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const userWrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (
        menuOpen &&
        userWrapRef.current &&
        !userWrapRef.current.contains(t) &&
        menuRef.current &&
        !menuRef.current.contains(t)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
        onLoginSuccess={handleLoginSuccess}
      />

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        options={hydrated ? options : []}
        selectedId={hydrated ? primaryAddress?.id ?? null : null}
        onConfirm={async (id) => {
          startAddressSwitch(700);
          const { setDefaultAddress } = await import("@features/address/action");
          await setDefaultAddress(id);
          await fetchAddresses();
          window.dispatchEvent(new Event("addressUpdated"));
          setIsAddressModalOpen(false);
        }}
        onMakePrimary={async (id) => {
          startAddressSwitch(700);
          const { setDefaultAddress } = await import("@features/address/action");
          await setDefaultAddress(id);
          await fetchAddresses();
          window.dispatchEvent(new Event("addressUpdated"));
          setIsAddressModalOpen(false);
        }}
        onAddNew={() => {
          setIsAddressModalOpen(false);
          router.push("/account/address/new");
        }}
      />

      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSearchFocused(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="user-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <header className="hidden md:block bg-white sticky top-0 z-50 shadow-sm w-full">
        <div className="bg-tertiary">
          <div className="max-w-screen-xl mx-auto px-8 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 py-1">
              <TagIcon />
              <span className="text-secondary">
                Raih Pemasukan Tambahan dengan{" "}
                <a href="#" className="font-bold text-primary hover:underline">
                  Bergabung Affiliate ›
                </a>
              </span>
            </div>
            <div className="text-secondary flex justify-end gap-6">
              <a href="#" className="hover:text-primary">
                Tentang PE Skinpro
              </a>
              <a href="#" className="hover:text-primary">
                Pusat Edukasi Seller
              </a>
              <a href="#" className="hover:text-primary">
                Promo
              </a>
              <a href="#" className="hover:text-primary">
                PE Skinpro Care
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-8">
          <div className="flex items-center gap-6 py-3">
            <Link href="/" className="relative h-10 w-40 shrink-0">
              <Image
                src="/Logo.png"
                alt="PE Skinpro Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 120px, 160px"
                priority
              />
            </Link>



            {/* Search */}
            <div className="flex-grow relative mx-4" ref={searchContainerRef}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Cari Produk PE"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                    setIsSearchFocused(false);
                  }
                }}
                className="w-full border border-gray-300 rounded-lg py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary relative z-50"
                onFocus={() => setIsSearchFocused(true)}
              />
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto"
                  >
                    {isLoading ? (
                      <div className="py-2 px-4 space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex gap-3">
                            <Skeleton width={40} height={40} className="rounded shrink-0" />
                            <div className="flex-1 space-y-2">
                              <Skeleton width="80%" height={14} />
                              <Skeleton width="40%" height={12} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchSuggestions.length > 0 ? (
                      <div className="py-2">
                        <div className="px-4 py-2 text-xs text-secondary font-semibold">
                          Produk yang cocok
                        </div>
                        {searchSuggestions.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          >
                            <Image
                              src={product.img}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-base-text truncate">
                                {product.name}
                              </div>
                              <div className="text-xs text-secondary truncate">
                                {product.category}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-primary">
                              {product.price}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : searchQuery.trim().length >= 2 ? (
                      <div className="p-4 text-center text-sm text-secondary">
                        Tidak ada produk yang cocok
                      </div>
                    ) : (
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <SearchIcon className="h-4 w-4 text-secondary" />
                          <span className="text-sm text-secondary">
                            Ketik minimal 2 huruf untuk mencari produk
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <AuthAction
                as="button"
                className="relative cursor-pointer"
                isLoggedIn={isLoggedIn}
                onRequireAuth={() => setIsAuthModalOpen(true)}
                href="/cart"
              >
                <CartIcon withBadge count={cartCount} />
              </AuthAction>

              <AuthAction
                as="button"
                className="cursor-pointer"
                isLoggedIn={isLoggedIn}
                onRequireAuth={() => setIsAuthModalOpen(true)}
                href="/notification"
              >
                <BellIcon />
              </AuthAction>

              <div className="border-l h-8 mx-2" />

              {isLoggedIn ? (
                <div
                  ref={userWrapRef}
                  className="relative"
                  onMouseEnter={() => setMenuOpen(true)}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                    onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
                    className="group flex items-center gap-3 rounded-full pl-1 pr-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 hover:bg-tertiary transition-colors"
                  >
                    <Avatar
                      name={user.name}
                      avatarUrl={user.avatarUrl}
                      size="md"
                      className="ring-1 ring-black/5"
                    />
                    <span className="font-medium text-sm text-gray-800 group-hover:text-gray-900 max-w-[180px] truncate">
                      {user.name}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        ref={menuRef}
                        role="menu"
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.14, ease: "easeOut" }}
                        // Lebar besar agar terasa "sampai cart"
                        className="absolute right-0 mt-2 w-[580px] max-w-[calc(100vw-2rem)] z-[60]"
                      >
                        <div className="rounded-2xl border border-black/5 bg-white/90 backdrop-blur-md shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
                          {/* Header user */}
                          <div className="p-4 flex items-center gap-3">
                            <Avatar
                              name={user.name}
                              avatarUrl={user.avatarUrl}
                              size="lg"
                              className="ring-1 ring-black/5"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold leading-5 text-gray-900 truncate">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {user.email}
                              </div>
                            </div>
                            <div className="ml-auto hidden md:flex items-center gap-2">
                              <Link
                                href="/account"
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                onClick={() => setMenuOpen(false)}
                              >
                                Lihat Profil
                              </Link>
                            </div>
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                          {/* Isi menu */}
                          <div className="grid grid-cols-2">
                            <div className="p-2">
                              <MenuItem
                                href="/account"
                                label="Akun Saya"
                                onDone={() => setMenuOpen(false)}
                              />
                              <MenuItem
                                href="/account/transaction"
                                label="Daftar Transaksi"
                                onDone={() => setMenuOpen(false)}
                              />
                            </div>

                            <div className="p-2 border-l border-gray-100">
                              <MenuItem
                                href="/account/address"
                                label="Alamat"
                                onDone={() => setMenuOpen(false)}
                              />
                              <button
                                type="button"
                                className="w-full text-left cursor-pointer"
                                onClick={async () => {
                                  // Block logout on checkout and cart pages
                                  const currentPath = window.location.pathname;
                                  if (currentPath.includes('/checkout') || currentPath.includes('/cart')) {
                                    toast.error("Tidak bisa logout saat di halaman checkout atau cart");
                                    setMenuOpen(false);
                                    return;
                                  }

                                  setMenuOpen(false);
                                  await logout();
                                  setIsLoggedIn(false);
                                  setCurrentUserId(null);
                                  // Clear user ID from session storage
                                  setCartUserId(null);
                                  // Reload current page instead of redirecting
                                  window.location.reload();
                                }}
                              >
                                <MenuItem label="Keluar" asButton danger />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/register")}
                    className="border border-border-color font-semibold text-primary px-6 py-2 rounded-lg hover:bg-tertiary transition-colors"
                  >
                    Daftar
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-primary font-semibold text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Masuk
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bar alamat saat LOGIN */}
        {isLoggedIn && (
          <>
            <div className="border-b border-gray-200" />
            <div className="max-w-screen-xl mx-auto px-8">
              <div className="flex justify-end items-center py-2">
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center gap-2 text-sm text-secondary cursor-pointer"
                >
                  <LocationIcon className="h-4 w-4" />
                  {switching ? (
                    <Skeleton width={160} height={16} className="rounded" />
                  ) : (
                    <span className="text-secondary">
                      Dikirim ke{" "}
                      <span
                        className="font-bold text-gray-800"
                        suppressHydrationWarning
                      >
                        {label}
                      </span>
                    </span>
                  )}
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};
