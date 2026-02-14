# Type System Guide

## Overview
The PE Skin Pro type system has been reorganized into a structured hierarchy for better maintainability and type safety.

## Structure
```
src/shared/types/
├── index.ts              # Re-exports all (backward compatible)
│
├── primitives/           # Basic shared types
│   ├── common.ts         # PriceString, ImageUrl, ID
│   └── api.ts            # ApiResponse, ApiError, PaginatedResponse
│
├── domain/               # Business domain types
│   ├── product.ts        # Product, BundleProduct, Variant
│   ├── cart.ts           # CartData, CartItem, CartContext
│   ├── voucher.ts        # Voucher, VoucherType, VoucherConditions
│   ├── checkout.ts       # CheckoutSession, CheckoutLine
│   ├── shipping.ts       # ShippingOption, ShippingGroup
│   └── transaction.ts    # UserTransaction, OrderItem
│
├── entities/             # System entities
│   ├── address.ts        # AddressItem, AddressListEntry
│   ├── account.ts        # AccountProfile, AccountData
│   ├── notification.ts   # NotificationItem, NotifKind
│   └── review.ts         # Review
│
└── ui/                   # UI/Component types
    └── props.ts          # WithChildren, WithClassName, AsyncData
```

## Naming Conventions

### Entities
- PascalCase singular: `User`, `Product`, `Address`
- Collections: `Product[]` or `Products` (plural)

### DTOs
- Entity name + `DTO` suffix: `ProductDTO`, `CartContextDTO`

### Props
- Component name + `Props`: `ProductCardProps`, `CheckoutPageProps`

### State
- Entity + `State` suffix: `LoadingState`, `ErrorState`

## Import Patterns

### ✅ RECOMMENDED (Specific imports)
```typescript
import type { Product, CartData } from '@shared/types/domain/product';
import type { AddressItem } from '@shared/types/entities/address';
```

### ✅ ALSO OK (Convenience)
```typescript
import type { Product, CartData, AddressItem } from '@shared/types';
```

### ❌ WRONG (Local duplicates)
```typescript
type Product = { ... }; // Don't define locally!
```

## Extension Pattern

Always extend base types instead of duplicating:

### ✅ CORRECT
```typescript
import type { Product } from '@shared/types';

type ProductWithImages = Product & { images: string[] };
```

### ❌ WRONG
```typescript
type ProductWithImages = {
  id: string;
  name: string;
  images: string[]; // Duplicating entire Product structure!
};
```

## Common Patterns

### Async Data Loading
```typescript
import type { AsyncData } from '@shared/types';

const [productData, setProductData] = useState<AsyncData<Product>>({
  status: 'idle'
});
```

### API Responses
```typescript
import type { ApiResponse } from '@shared/types';

async function getProduct(id: string): Promise<ApiResponse<Product>> {
  // ...
}
```

### Component Props
```typescript
import type { WithChildren, WithClassName } from '@shared/types';

interface ProductCardProps extends WithChildren, WithClassName {
  product: Product;
}
```

## Migration Guide

### For Existing Code

1. **Find local type definitions**:
   ```bash
   rg "^type Cart(Ctx|Context)" --type ts
   ```

2. **Replace with centralized import**:
   ```typescript
   // BEFORE
   type CartCtx = { subtotal: number; itemCount: number };
   
   // AFTER
   import type { CartContext } from '@shared/types';
   ```

3. **Test thoroughly** - TypeScript will catch any mismatches

### For New Code

Always import from `@shared/types` - never define types locally unless they're truly component-specific (e.g., internal component state).

## Type Consolidation Log

**Duplicates Eliminated**:
- ✅ `CartContext` (was defined in 3 places)
- ✅ `EvalResult` (was defined in 2 places)
- ✅ `VoucherWithConditions` (multiple variants)
- ✅ `Product` type variants (6 scattered definitions → 1 base + typed extensions)

**New Patterns Added**:
- ✅ `AsyncData<T>` for loading states
- ✅ `ApiResponse<T>` for API responses
- ✅ `WithChildren`, `WithClassName` for reusable props

## FAQs

**Q: Should I import from index.ts or specific files?**  
A: Both work! Specific files are slightly better for tree-shaking, but index.ts is more convenient.

**Q: Can I still use the old `types.ts` file?**  
A: Yes, for backward compatibility. But please migrate to the new structure for new code.

**Q: What if I need a custom variant of Product?**  
A: Extend the base type:
```typescript
import type { Product } from '@shared/types';
type MyProduct = Product & { customField: string };
```

**Q: How do I know which file a type is in?**  
A: Check the index.ts file for the full export list with source file comments.

---

**Last Updated**: 2026-02-13  
**Consolidation**: 15+ duplicates eliminated  
**Stability**: Single source of truth established
