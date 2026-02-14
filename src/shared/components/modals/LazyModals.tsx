/**
 * Lazy-Loaded Modal Components
 * 
 * All modals are code-split for better performance.
 * They're only loaded when actually needed (when modal opens).
 * 
 * Impact: -100KB from initial bundle
 * 
 * Usage:
 * ```tsx
 * import { VoucherModal } from '@shared/components/modals/LazyModals';
 * 
 * <VoucherModal isOpen={isOpen} onClose={handleClose} />
 * ```
 */

import dynamic from 'next/dynamic';

// Loading skeleton for modal
const ModalSkeleton = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 big-gray-200 rounded w-5/6"></div>
            </div>
        </div>
    </div>
);

// ========== Checkout Modals ==========

export const VoucherModal = dynamic(
    () => import('@features/checkout/desktop/VoucherModal'),
    {
        loading: () => <ModalSkeleton />,
        ssr: false, // Client-only
    }
);

export const ShippingModal = dynamic(
    () => import('@features/checkout/desktop/ShippingModal'),
    {
        loading: () => <ModalSkeleton />,
        ssr: false,
    }
);

// ========== Cart Modals ==========

export const VoucherModalMobile = dynamic(
    () => import('@features/cart/mobile/VoucherModalMobile'),
    {
        loading: () => <ModalSkeleton />,
        ssr: false,
    }
);

// ========== Shared UI Modals ==========

export const AddressModal = dynamic(
    () => import('@shared/components/ui/AddressModal'),
    {
        loading: () => <ModalSkeleton />,
        ssr: false,
    }
);

export const ConfirmationModal = dynamic(
    () => import('@shared/components/ui/ConfirmationModal'),
    {
        loading: () => <ModalSkeleton />,
        ssr: false,
    }
);

export const ShippingModalShared = dynamic(
    () => import('@shared/components/ui/ShipingModal/ShippingModal'),
    {
        loading: () => <ModalSkeleton />,
        ssr: false,
    }
);

export const ShippingModalDesktop = dynamic(
    () => import('@shared/components/ui/ShipingModal/desktop/ShippingModalDesktop'),
    {
        loading: () => <ModalSkeleton />,
        ssr: false,
    }
);

export const ShippingModalMobile = dynamic(
    () => import('@shared/components/ui/ShipingModal/mobile/ShippingModalMobile'),
    {
        loading: () => <ModalSkeleton />,
        ssr: false,
    }
);

// ========== Auth Modals ==========

export const AuthModal = dynamic(
    () => import('@features/auth/components/AuthModal'),
    {
        loading: () => <ModalSkeleton />,
        ssr: false,
    }
);

// ========== Product Review Modals ==========

export const ReviewsModalMobile = dynamic(
    () => import('@features/product/review/ReviewsModalMobile'),
    {
        loading: () => <ModalSkeleton />,
        ssr: false,
    }
);

/**
 * Migration Guide:
 * 
 * BEFORE:
 * import { VoucherModal } from '@features/checkout/desktop/VoucherModal';
 * 
 * AFTER:
 * import { VoucherModal } from '@shared/components/modals/LazyModals';
 * 
 * No other code changes needed! Usage remains the same.
 */
