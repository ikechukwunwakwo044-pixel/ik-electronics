# IK Electronics - Shopping Cart Design

## Design Principles (from ui-ux-design skill)
- Design around IK Electronics and Gadgets, not a generic AI-looking store
- Prioritize mobile-first responsive design with strong desktop and tablet support
- Use clear spacing, typography hierarchy, visual hierarchy, and product-focused layouts
- Include loading, skeleton, error, empty, confirmation, and success states
- Make forms accessible and easy to complete
- Use trust signals, clear pricing, availability, delivery information, and customer-friendly CTAs

## Shopping Cart Overview

The shopping cart is a critical e-commerce component that allows users to:
- Add products they wish to purchase
- Review and modify selected items
- Proceed to checkout
- Persist cart across sessions (via localStorage or database)

## 1. Cart State Management Approach

### Recommended Solution: React Context API
- Lightweight and built into Next.js/React
- Sufficient for cart complexity (typically <50 items)
- Easy to persist to localStorage
- Alternative: Zustand or Redux Toolkit for more complex needs

### Cart Data Structure
```javascript
const cart = {
  items: [
    {
      id: "cart-item-uuid", // Unique cart item ID
      productId: "product-uuid", 
      product: {
        id: "product-uuid",
        name: "Product Name",
        slug: "product-slug",
        price: 29999, // in smallest currency unit (cents)
        compare_at_price: 39999,
        images: ["url1", "url2"],
        stock_quantity: 25
      },
      quantity: 2,
      selectedOptions: { // For future variants (size, color, etc.)
        // size: "Large",
        // color: "Black"
      }
    }
  ],
  subtotal: 59998, // Sum of (price * quantity) for all items
  itemCount: 4, // Total quantity of all items
  discount: 0, // For future coupon codes
  tax: 0, // Calculated based on location
  shipping: 0, // Calculated based on location/method
  total: 59998 // subtotal - discount + tax + shipping
}
```

## 2. Cart UI Components

### A. Cart Icon in Header (Persistent)
```
[Header Layout]
[Logo] [Navigation Links] [Spacer] [Cart Icon] [User Icon]

[Cart Icon]
- Container: Position: relative
- Icon: Shopping bag/lucide icon (24x24px)
- Badge: Absolute positioned top-right
  * Background: #ef4444 (red-500)
  * Color: White
  * Size: 20x20px minimum, expands with count
  * Shows: Item count (not product count)
  * Hidden when count = 0
- Hover/Focus: Scale 1.1, transition
- Accessibility: Aria-label="Cart (3 items)" or "Cart empty"

[Micro-interaction on Add to Cart]
- Icon pulses/animates briefly
- Badge updates with count
- Optional: Fly-in animation from product to cart icon
```

### B. Cart Dropdown/Popup (on click/icon hover)
```
[Cart Dropdown]
- Trigger: Click on cart icon (or hover on desktop)
- Position: Fixed/top-right, below header
- Width: 320px (mobile: 90vw max-width 320px)
- Max-height: 80vh (scrollable if overflow)
- Background: White, Border-radius: 12px, Shadow: elevated
- Z-index: Above all content

[Dropdown Header]
- Title: "Your Cart" (font-semibold text-lg)
- Subtitle: "[X] items" (text-sm text-muted-foreground)
- Close Button: X icon (top-right)

[Cart Items List]
- Each item as a CartItemComponent
- Spacing: 6px between items
- If empty: Show EmptyState component

[Cart Summary Section]
- Divider: 1px solid #e2e8f0
- Subtotal: Label + Amount (justify-between)
- [If discount]: Discount: Label + Amount (justify-between)
- [If tax]: Tax: Label + Amount (justify-between)
- [If shipping]: Shipping: Label + Amount (justify-between)
- Total: Label + Amount (justify-between, font-bold text-xl, border-top pt-4)
- [If total > 0]: Checkout Button: Full width, primary variant, "Proceed to Checkout"
- [If total = 0]: Message: "Your cart is empty" + "Continue Shopping" button

[CartItemComponent]
- Layout: Flex, align-items-start, gap-4, p-4
- [Left]: Product Image
  * Aspect ratio: 4/3 or 1:1
  * Border-radius: 8px
  * Background: #f8fafc
  * Size: 80px width, height auto
- [Middle]: Product Details
  * Name: Text-base font-medium, max 2 lines
  * Options: Text-xs text-muted-foreground (if variants selected)
  * Quantity Controls: 
    - Button: "-" (decrement, disabled if qty=1)
    - Input: type="number", min=1, max=stock, value={quantity}, width: 44px
    - Button: "+" (increment, disabled if qty=max)
    - Label: "Qty" (visually hidden for accessibility)
  * Price: 
    * Current: Font-semibold text-lg
    * Original: If compare_at_price > price: line-through text-muted-foreground
    * Savings: If discount: text-green-600 "You save: X"
- [Right]: Action Buttons
  * Save for Later: Icon button (heart outline) + tooltip
  * Remove: Icon button (trash) + tooltip (red hover)

### C. Dedicated Cart Page (/cart)
```
[Page Layout]
[Header: Back arrow + Title: "Shopping Cart"]

[If Cart Has Items]
  [Cart Items Section]
    - Title: "Cart Items" (text-2xl font-bold mb-6)
    - [Same CartItemComponent as dropdown, but full width]
    - Each item with full controls and details
    
  [Cart Summary Section] (Sticky on desktop, bottom on mobile)
    - Background: White, Border-top: 1px solid #e2e8f0
    - Padding: 6px
    - Same summary layout as dropdown but more detailed
    - Estimated totals: Tax, shipping calculations
    - Coupon code field: Input + Apply button
    - Checkout Button: Full width, primary variant, "Proceed to Checkout" (disabled if empty)
    
[Else: Empty Cart State]
  - Illustration: Empty cart graphic or icon
  - Title: "Your cart is empty"
  - Description: "Add products to your cart to get started"
  - Button: "Continue Shopping" (links to /products)
  - Optional: Recently viewed or recommended products carousel

[Mobile Considerations]
- Sticky bottom bar on cart page: Always visible Checkout button
- Touch-friendly controls: Minimum 44x44pt tap targets
- Quantity input: Use numeric keyboard, stepper buttons
```

## 3. User Interactions & States

### Adding to Cart
- From Product Card: "Add to Cart" button (instead of just "View")
- From Product Page: Prominent "Add to Cart" button below price
- Animation: Product image flies to cart icon or cart count pulses
- Feedback: Toast notification "Product added to cart" with undo option
- Stock checking: Disable button if out of stock, show "Out of stock"

### Quantity Management
- Increment/decrement buttons
- Direct input validation (min 1, max stock)
- Immediate price update as quantity changes
- Stock limit warning: "Only X left in stock" when near limit

### Removal
- Remove button with confirmation: "Remove this item?" [Cancel] [Remove]
- Swipe-to-remove on mobile (optional)
- Undo option after removal (brief timeout)

### Save for Later / Wishlist
- Moves item to wishlist section
- Visual indicator: Heart fills or changes color
- Accessible from wishlist page or cart

### Persistence Strategy
- **Primary**: localStorage (immediate, no server dependency)
- **Hybrid**: localStorage + periodic sync to Supabase (for logged-in users)
- **Authenticated Users**: Merge localStorage cart with database cart on login
- **Cart ID**: Generate UUID for anonymous cart, link to user ID on login

## 4. Accessibility & Responsiveness

### Accessibility
- All interactive elements: proper ARIA labels
- Cart count: Aria-label updates with item count
- Quantity inputs: Associated labels, proper step/min/max attributes
- Error messages: ARIA-live regions for validation
- Focus management: Trap focus in dropdown, return focus to cart icon on close
- Color contrast: WCAG AA minimum for all text and icons

### Responsiveness Breakpoints
- **Mobile (<640px)**: 
  - Cart dropdown: Full width minus 16px margins
  - Cart page: Full width padding
  - Touch targets: Minimum 44x44px
  
- **Tablet (640px-1024px)**:
  - Cart dropdown: 320px fixed width
  - Cart page: 80% width max-width 500px, centered
  
- **Desktop (>1024px)**:
  - Cart dropdown: 320px fixed width
  - Cart page: 70% width max-width 600px, centered
  - Optional: Sidebar layout (cart summary beside items)

## 5. Technical Implementation Notes

### API Endpoints (if using database persistence)
- `GET /api/cart` - Retrieve current cart
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/[itemId]` - Update quantity/options
- `DELETE /api/cart/items/[itemId]` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Supabase Integration (Optional)
- Table: `public.carts` (id, user_id, created_at, updated_at)
- Table: `public.cart_items` (id, cart_id, product_id, quantity, options, created_at)
- RLS: Users can only access their own cart
- Trigger: Update cart timestamp on item changes

### Performance Optimizations
- Debounce quantity updates (300ms) to prevent excessive re-renders
- Use useMemo for expensive calculations (totals, discounts)
- Virtual scroll for large carts (rare but possible)
- Optimistic UI updates for better perceived performance

### Security Considerations
- Validate product existence and stock on add/update
- Server-side validation of quantities and prices
- Rate limiting on cart modification endpoints
- Sanitize any user-input data (notes, etc.)

## 6. Edge Cases & Error Handling

### Stock Changes
- If stock decreases below cart quantity: Adjust to max available, notify user
- If product becomes unavailable: Remove from cart, show notification
- If price changes: Honor cart price or update with notice (configurable)

### Concurrent Modifications
- Last-write-wins with timestamps
- Merge strategies for multi-device users
- Clear conflict resolution UI if needed

### Privacy & GDPR
- Cart data considered personal data when linked to user
- Clear data retention policy
- Option to clear cart history

## 7. UI/UX Best Practices Applied

### From ui-ux-design skill:
- **Clear spacing**: Consistent 4px/8px/16px spacing system
- **Typography hierarchy**: Clear distinction between headers, body, captions
- **Visual hierarchy**: Cart summary visually distinct from items
- **Product-focused layouts**: Product image prominent in cart items
- **States included**: Loading, empty, error, success states all designed
- **Accessible forms**: Proper labels, validation, error messaging
- **Trust signals**: Security icons, clear policies, transparent pricing
- **Customer-friendly CTAs**: Action-oriented button text, clear next steps

## Implementation Priority
1. Cart Context API + localStorage persistence
2. Cart icon with badge in header
3. Add to Cart buttons on product pages/cards
4. Cart dropdown/popup
5. Dedicated cart page
6. Quantity management and removal
7. Save for later/wishlist integration
8. Coupon code system (future)
9. Database persistence for authenticated users (future)

## Next Steps After Design
1. Create cart context and hooks
2. Implement header cart icon
3. Add "Add to Cart" components to product cards and product page
4. Build cart dropdown/popup
5. Create dedicated cart page (/cart)
6. Implement persistence and synchronization
7. Add UI enhancements (animations, micro-interactions)
8. Test edge cases and accessibility