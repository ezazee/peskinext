"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import DesktopCheckout from "./desktop/DesktopCheckout";
import MobileCheckout from "./mobile/MobileCheckout";
import type { CartData, CheckoutSession } from "@shared/types/types";
import CheckoutSkeletonShell from "./desktop/skeleton/CheckoutSkeletonShell";
import { getCart, removeSelectedItems } from "@features/cart/cartService";
import { motion, AnimatePresence } from "framer-motion";
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function CheckoutClient({
  checkoutSession
}: {
  checkoutSession: CheckoutSession | null;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<CartData>({ items: [] });
  const [isValidating, setIsValidating] = useState(true);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
    actionUrl?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const oid = searchParams.get('oid');

  useEffect(() => {
    // If we have a checkout session, clear the cart
    if (checkoutSession) {
      console.log("🛒 Checkout session detected, clearing cart");
      removeSelectedItems();
      console.log("✅ Cart cleared on checkout page entry");
    } else {
      // Otherwise, load cart from localStorage
      const loadedCart = getCart();
      setCart(loadedCart);
    }
    setMounted(true);
  }, [checkoutSession, checkoutSession?.id]);

  // Validate Order Status
  useEffect(() => {
    if (!oid) {
      setIsValidating(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";
        const res = await fetch(`${API_URL}/orders/detail/${oid}`);

        if (!res.ok) {
          console.error("Failed to fetch order details");
          setIsValidating(false);
          return;
        }

        const order = await res.json();

        if (order.status === 'paid') {
          setModal({
            isOpen: true,
            title: "Pembayaran Berhasil",
            message: "Order ini sudah dibayar sebelumnya.",
            type: "success",
            actionUrl: "/account/transaction"
          });
          setIsValidating(false); // Stop validating to show modal
          return;
        }

        if (order.status === 'cancelled' || order.status === 'expired') {
          setModal({
            isOpen: true,
            title: "Order Tidak Tersedia",
            message: "Order ini sudah kadaluarsa atau dibatalkan.",
            type: "error",
            actionUrl: "/cart"
          });
          setIsValidating(false);
          return;
        }

        setIsValidating(false);
      } catch (error) {
        console.error("Error validating order:", error);
        setIsValidating(false);
      }
    };

    checkStatus();
  }, [oid, router]);

  const handleModalClose = () => {
    if (modal.actionUrl) {
      router.replace(modal.actionUrl);
    }
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  if (!mounted || isValidating) return <CheckoutSkeletonShell />;

  return (
    <>
      <AnimatePresence>
        {modal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${modal.type === 'success' ? 'bg-green-100 text-green-600' :
                  modal.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                  {modal.type === 'success' ? (
                    <CheckCircleIcon className="w-8 h-8" />
                  ) : (
                    <ExclamationTriangleIcon className="w-8 h-8" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{modal.title}</h3>
                <p className="text-gray-600 mb-6">{modal.message}</p>
                <button
                  onClick={handleModalClose}
                  className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition active:scale-[0.98]"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile
        ? <MobileCheckout initialCart={cart} checkoutSession={checkoutSession} />
        : <DesktopCheckout initialCart={cart} checkoutSession={checkoutSession} />
      }
    </>
  );
}
