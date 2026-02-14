/**
 * Centralized Type System Index
 * 
 * This file re-exports all types from the organized type structure for backward compatibility.
 * Prefer importing from specific files when creating new code:
 * 
 * ✅ RECOMMENDED:
 * import type { Product, CartData } from '@shared/types/domain/product';
 * import type { AddressItem } from '@shared/types/entities/address';
 * 
 * ✅ ALSO OK (for convenience):
 * import type { Product, CartData, AddressItem } from '@shared/types';
 */

// ============ Primitives ============
export type {
    PriceString,
    ImageUrl,
    ID,
} from './primitives/common';

export type {
    ApiResponse,
    ApiError,
    PaginatedResponse,
    SearchResult,
} from './primitives/api';

// ============ Domain Types ============
export type {
    CartItem,
    CartData,
    CartContext,
    CartContextDTO,
} from './domain/cart';

export type {
    Voucher,
    VoucherType,
    VoucherConditions,
    VoucherWithConditions,
    VoucherSelection,
    RedeemResult,
    EvalResult,
} from './domain/voucher';

export type {
    Product,
    Variant,
    BundleProduct,
    BundleVariant,
    ProductForShipping,
    ProductWithImages,
    MinimalProduct,
    OrderProductSnapshot,
} from './domain/product';

export type {
    CheckoutSource,
    CheckoutLine,
    CheckoutSession,
} from './domain/checkout';

export type {
    ShippingOption,
    ShippingGroup,
    ShippingDetailData,
    ShippingOrder,
} from './domain/shipping';

export type {
    TransactionStatus,
    OrderItem,
    UserTransaction,
} from './domain/transaction';

// ============ Entity Types ============
export type {
    AddressItem,
    AddressListEntry,
} from './entities/address';

export type {
    IconName,
    AccountProfile,
    AccountData,
} from './entities/account';

export type {
    NotifKind,
    NotifStatus,
    NotificationItem,
} from './entities/notification';

export type {
    Review,
} from './entities/review';

// ============ UI Types ============
export type {
    WithChildren,
    WithClassName,
    BaseProps,
    LoadingState,
    ErrorState,
    AsyncData,
} from './ui/props';

// ============ Legacy Types (imported from old types.ts) ============
// These types remain in the old file until fully migrated
// TODO: Move these to appropriate organized files

export type {
    Category,
    NavItem,
    Banner,
    BannersResponse,
    PromoShowcaseProps,
    EventPromoProps,
    DesktopDetailProps,
    MobileDetailProps,
} from './types';
