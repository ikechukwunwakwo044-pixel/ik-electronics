# IK Electronics - Checkout Process Design

## Design Principles (from ui-ux-design skill)
- Design around IK Electronics and Gadgets, not a generic AI-looking store
- Prioritize mobile-first responsive design with strong desktop and tablet support
- Use clear spacing, typography hierarchy, visual hierarchy, and product-focused layouts
- Include loading, skeleton, error, empty, confirmation, and success states
- Make forms accessible and easy to complete
- Use trust signals, clear pricing, availability, delivery information, and customer-friendly CTAs

## Checkout Process Overview

The checkout process converts cart items into an order by collecting:
1. Customer information (email, phone)
2. Shipping address
3. Billing address (optional, can copy from shipping)
4. Shipping method selection
5. Order review
6. Payment processing
7. Order confirmation

## 1. Checkout Flow Architecture

### Recommended Approach: Multi-step Progress Indicator
- Clear step-by-step progression reduces anxiety
- Users can see progress and navigate between steps (if valid)
- Mobile: Full-screen steps, Desktop: Sidebar progress + main content

### Steps Overview
```
Step 1: Contact Information
  → Email, Phone
  
Step 2: Shipping Address
  → Address form, Address validation, "Use as billing" option
  
Step 3: Shipping Method
  → Available options with prices and delivery estimates
  
Step 4: Payment Information
  → Payment method selection, Card details (if applicable)
  
Step 5: Review & Place Order
  → Order summary, Terms & conditions, Place order button
  
Step 6: Order Confirmation
  → Success message, Order number, Next steps
```

## 2. Step-by-Step Design Specifications

### A. Checkout Page Layout (Container)
```
[Checkout Container]
- Max-width: 1200px (desktop), 90vw (tablet/mobile)
- Margin: 0 auto
- Padding: 16px
- Background: #f8fafc (gray-50)
- Min-height: 100vh

[Progress Indicator]
- Horizontal steps: 1 2 3 4 5 6 (desktop)
- Vertical steps: 1. 2. 3. 4. 5. 6. (mobile)
- Current step: Highlighted (primary color)
- Completed steps: Checkmark icon + muted text
- Future steps: Number only (disabled appearance)
- Step labels: Contact Info → Shipping → Shipping Method → Payment → Review → Confirmation

[Main Content Area]
- Background: White
- Border-radius: 12px
- Box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
- Padding: 24px
- Margin-top: 24px

[Mobile Adaptation]
- Full-width steps (accordion style)
- Each step expands/collapses
- Current step auto-expands
```

### B. Step 1: Contact Information
```
[Section Title]
- "Contact Information" (text-2xl font-bold mb-4)
- Description: "We'll use this to confirm your order and send updates" (text-sm text-muted-foreground mb-6)

[Form Fields]
- Email Input:
  * Label: "Email address"
  * Input: type="email", required, autocomplete="email"
  * Placeholder: "you@example.com"
  * Helper text: "We'll send order confirmation to this email"
  
- Phone Input:
  * Label: "Phone number"
  * Input: type="tel", required, autocomplete="tel"
  * Placeholder: "+234 XXX XXX XXXX"
  * Helper text: "For delivery updates and order inquiries"
  * Prefix: "+234" (Nigeria) or dynamic based on IP
  * Validation: Nigerian phone number format

[Trust Signals]
- Security icon + text: "Your information is secure"
- Privacy link: "We respect your privacy. View our Privacy Policy"

[Button Row]
- Back: Not applicable (first step)
- Continue: "Continue to Shipping" (primary button, disabled if form invalid)
```

### C. Step 2: Shipping Address
```
[Section Title]
- "Shipping Address" (text-2xl font-bold mb-4)
- Description: "Where we'll send your order" (text-sm text-muted-foreground mb-6)

[Address Form]
- Full Name:
  * Label: "Full name"
  * Input: required, autocomplete="name"
  * Placeholder: "John Doe"
  
- Phone Number:
  * Label: "Phone number"
  * Input: type="tel", required, autocomplete="tel"
  * Pre-filled from contact step (editable)
  
- Address Line 1:
  * Label: "Street address"
  * Input: required, autocomplete="street-address"
  * Placeholder: "123 Ikeja Street"
  
- Address Line 2:
  * Label: "Apartment, suite, etc. (optional)"
  * Input: autocomplete="address-line2"
  * Placeholder: "Flat 4B"
  
- City:
  * Label: "City"
  * Input: required, autocomplete="address-level2"
  * Placeholder: "Lagos"
  
- State:
  * Label: "State"
  * Input: required, autocomplete="address-level1"
  * Placeholder: "Select state"
  * Options: Dropdown of Nigerian states
  
- ZIP/Postal Code:
  * Label: "Postal code"
  * Input: required, autocomplete="postal-code"
  * Placeholder: "100001"
  
- Country:
  * Label: "Country"
  * Input: type="text", value="Nigeria", disabled, autocomplete="country"
  * Hidden: stored as constant

[Address Validation]
- Real-time validation as user types
- Suggestion: "Did you mean: [corrected address]?"
- Integration with address verification API (future)

[Billing Address Section]
- Checkbox: "Ship to billing address" (checked by default)
- When unchecked: Show identical billing address form below
- When checked: Hide billing form, use shipping address for billing

[Button Row]
- Back: "Go back to Contact" (secondary button)
- Continue: "Continue to Shipping Method" (primary button)
```

### D. Step 3: Shipping Method
```
[Section Title]
- "Shipping Method" (text-2xl font-bold mb-4)
- Description: "Choose how you'd like to receive your order" (text-sm text-muted-foreground mb-6)

[Shipping Options]
Each option as a selectable card:

[Option 1: Standard Delivery]
- Radio button + Label container
- Title: "Standard Delivery"
- Price: "₦1,500" (or free if over threshold)
- Delivery estimate: "3-5 business days"
- Description: "Standard courier service"
- Icon: Truck/scooter icon
- [If free]: Badge: "FREE" (green background)

[Option 2: Express Delivery]
- Radio button + Label container
- Title: "Express Delivery"
- Price: "₦3,000"
- Delivery estimate: "1-2 business days"
- Description: "Fast courier with tracking"
- Icon: Truck/scooter + speed lines
- [If selected]: Highlight border (primary color)

[Option 3: Same-Day Delivery (Lagos only)]
- Radio button + Label container
- Title: "Same-Day Delivery"
- Price: "₦5,000"
- Delivery estimate: "Today if ordered before 2PM"
- Description: "Available in Lagos metropolitan area"
- Icon: Truck/scooter + clock
- [If not eligible]: Disabled, tooltip: "Not available in your area"

[Option 4: Pickup Point]
- Radio button + Label container
- Title: "Pickup Point"
- Price: "Free"
- Delivery estimate: "Ready in 2 hours"
- Description: "Collect from our Lagos/Ikeja warehouse"
- Icon: Location pin
- [Details]: "Bring ID and order confirmation"

[Shipping Calculator]
- Hidden by default, expands when needed
- For custom quotes or special requests

[Trust Signals]
- Estimated delivery date shown prominently
- "All shipments include tracking information"
- Link: "View our Shipping Policy"

[Button Row]
- Back: "Go back to Shipping Address"
- Continue: "Continue to Payment" (primary button)
```

### E. Step 4: Payment Information
```
[Section Title]
- "Payment Method" (text-2xl font-bold mb-4)
- Description: "How you'd like to pay for your order" (text-sm text-muted-foreground mb-6)

[Payment Options]
Each option as a selectable card:

[Option 1: Credit/Debit Card]
- Radio button + Label container (takes full width when selected)
- When selected: Expands to show card form below
- Title: "Credit or Debit Card"
- Icon: Card symbol
- Description: "Visa, Mastercard, Verve"
- [Storage]: "Securely save this card for future purchases" (checkbox)

[Card Form (when selected)]
- Card Number Input:
  * Label: "Card number"
  * Input: text, pattern="[0-9]{13,19}", autocomplete="cc-number"
  * Placeholder: "•••• •••• •••• ••••"
  * Formatting: Auto-spaces every 4 digits
  * Validation: Luhn algorithm, card type detection
  
- Expiration Date:
  * Label: "Expiration date"
  * Input: text, placeholder="MM / YYYY", autocomplete="cc-exp"
  * Split fields: Month (01-12) and Year (current year+10)
  
- CVV:
  * Label: "CVV"
  * Input: type="password", autocomplete="cc-csc", placeholder="•••"
  * Tooltip: "3-digit code on back of card"
  
- Card Type Indicator:
  * Shows detected card type logo (Visa, MC, Verve) as user types
  
[Option 2: Bank Transfer]
- Radio button + Label container
- Title: "Bank Transfer"
- Icon: Bank/buildings icon
- Description: "Pay via bank transfer to our account"
- Details: 
  * Bank Name: [Bank Name]
  * Account Name: IK Electronics and Gadgets
  * Account Number: [Account Number]
  * Reference: [Auto-generated Order Reference]
- Instructions: "Use your order number as payment reference"
- [Button]: "Copy Details"

[Option 3: USSD/Payment Link]
- Radio button + Label container
- Title: "Pay with Bank App/USSD"
- Icon: Phone/mobile banking icon
- Description: "Generate payment code for your banking app"
- Provider: "Works with all major Nigerian banks"
- [Button]: "Generate Payment Code" (shows modal with code and expiry)

[Option 4: Cash on Delivery]
- Radio button + Label container
- Title: "Cash on Delivery"
- Icon: Money/bills icon
- Description: "Pay when your order arrives"
- Additional fee: "₦500" (if applicable)
- [If eligible]: Available nationwide
- [If not]: Disabled with reason

[Trust Signals]
- SSL lock icon + "Secure payment processing"
- Badge: "PCI DSS Compliant"
- Text: "We never store your card details"
- Link: "View our Payment Security Policy"

[Button Row]
- Back: "Go back to Shipping Method"
- Continue: "Continue to Order Review" (primary button, disabled if payment invalid)
```

### F. Step 5: Review & Place Order
```
[Section Title]
- "Order Review" (text-2xl font-bold mb-4)
- Description: "Please review your order before placing it" (text-sm text-muted-foreground mb-6)

[Order Summary Section]
- Title: "Order Summary" (text-xl font-bold mb-4)
- [Cart Items Summary]
  * Each item: Product thumbnail, Name, Quantity, Price
  * Format: [Image] Product Name (x2) ₦5,999
  * If variants: Show selected options (size, color)
  
- [Order Totals]
  * Divider: 1px solid #e2e8f0
  * Items: Label + Amount (justify-between)
  * Shipping: Label + Amount (justify-between)
  * [If tax]: Tax: Label + Amount (justify-between)
  * [If discount]: Discount: Label + Amount (justify-between)
  * Total: Label + Amount (justify-between, font-bold text-xl, border-top pt-4, mt-2)
  
[Contact & Shipping Info]
- Title: "Contact Information" (text-xl font-bold mb-2)
  * Email: [user email]
  * Phone: [user phone]
  
- Title: "Shipping Address" (text-xl font-bold mb-2)
  * [Formatted address]
  * Shipping method: [Selected method] - [Delivery estimate]
  
- Title: "Payment Method" (text-xl font-bold mb-2)
  * [Selected payment method display]
  * [If card]: ****-****-****-1234 (Visa)
  * [If bank transfer]: Bank transfer instructions
  * [If COD]: Cash on delivery

[Terms & Conditions]
- Checkbox: Required
- Label: "I agree to the Terms of Service and Refund Policy"
- Links: 
  * Terms of Service (underlined, blue on hover)
  * Refund Policy (underlined, blue on hover)
- Text: "By placing this order, you agree to our terms"

[Security & Trust]
- Icon + text: "Your order is protected by buyer protection"
- Icon + text: "30-day easy returns"
- Icon + text: "Secure checkout guaranteed"

[Button Row]
- Back: "Go back to Payment"
- Place Order: 
  * Text: "Place Order" (primary button)
  * Loading state: Shows spinner + "Processing..."
  * Disabled: If form invalid or terms not checked
  * Style: Full width, height 48px, font-size lg
```

### G. Step 6: Order Confirmation
```
[Section Title]
- "Order Placed Successfully!" (text-2xl font-bold text-green-600 mb-4)
- Icon: Checkmark in green circle (48x48px)

[Confirmation Details]
- Order Number: 
  * Label: "Order #"
  * Value: IK-[TIMESTAMP]-[RANDOM] (e.g., IK-20261010-ABC123)
  * [Button]: "Copy Order Number"
  
- Status Badge:
  * Background: #dcfce7 (green-50)
  * Text: "Confirmed" (text-green-800 font-semibold)
  * Tooltip: "Order received and being processed"
  
- Estimated Delivery:
  * Label: "Expected delivery"
  * Value: [Date based on shipping method]
  * Icon: Truck/calendar

[Order Summary (mini)]
- Title: "Your Order"
- [Same mini cart items as review step]
- Total: Label + Amount (prominent display)

[Next Steps Section]
- Title: "What happens next?"
- [Icon + Text] items:
  * 📧 "You'll receive an order confirmation email"
  * 📦 "We'll prepare your order for shipment"
  * 🚚 "You'll get tracking info when it ships"
  * 💬 "Have questions? Contact us via WhatsApp"

[Action Buttons]
- Primary Button: "Track Your Order" (links to /orders/[order-id])
- Secondary Button: "Continue Shopping" (links to /products)
- Tertiary Button: "View Order History" (links to /profile/orders)

[Trust Footer]
- Badges: Secure checkout, Free returns, 24/7 support
- Text: "Thank you for shopping with IK Electronics and Gadgets!"
```

## 3. Form Validation & User Experience

### Validation Rules
- **Email**: Required, valid format, domain check (optional)
- **Phone**: Required, Nigerian format (+234 followed by 10-11 digits)
- **Name**: Required, min 2 characters, allows spaces/hyphens/apostrophes
- **Address**: Required fields, reasonable length limits
- **City**: Required, min 2 characters
- **State**: Required, selected from dropdown
- **Postal Code**: Required, Nigerian format (6 digits)
- **Card Number**: Required, Luhn valid, appropriate length
- **Expiry Date**: Required, future date, valid month/year
- **CVV**: Required, 3-4 digits depending on card type
- **Terms**: Required checkbox

### User Experience Enhancements
- **Inline Validation**: Show success (checkmark) or error (exclamation) as user types
- **Error Messages**: Clear, specific, actionable ("Please enter a valid email address")
- **Input Formatting**: Auto-format phone, card numbers, dates
- **Memory**: Remember recently used addresses for logged-in users
- **Progress Saving**: Save form data to localStorage to prevent loss on refresh
- **Keyboard Navigation**: Logical tab order, visible focus states
- **Mobile Optimizations**: 
  * Numeric keyboards for phone, postal code, card fields
  * Date pickers for expiration
  * Address autocomplete suggestions

### Error Prevention
- Disable buttons until form valid
- Confirm destructive actions (clear cart, etc.)
- Prevent double-submit (disable button on click)
- Timeout warnings for payment sessions
- Auto-apply cart discounts/promotions

## 4. Trust Signals & Security Elements

### Visual Trust Indicators
- SSL padlock icon in header/form sections
- Security badges: Norton, McAfee, PCI DSS, etc.
- Clear privacy policy links
- Transparent pricing (no hidden fees)
- Visible contact information (phone, email, WhatsApp)
- Social proof: "Join 5,000+ satisfied customers"
- Money-back guarantee badge
- Secure checkout seal

### Copy & Tone
- Reassuring microcopy: "We'll never share your information"
- Helpful placeholders showing expected format
- Action-oriented button text
- Friendly error messages ("Oops! Let's fix that...")
- Confirmation language: "Your order is confirmed!" vs "Success"

## 5. Technical Implementation Notes

### State Management
- **Approach**: React Context API or Zustand for checkout flow
- **Steps**: Array of step objects with validation status
- **Data**: Form values, shipping method, payment method, order summary
- **Persistence**: localStorage for recovery, Supabase for final order

### API Endpoints
- `POST /api/checkout/session` - Initialize checkout session
- `POST /api/checkout/shipping-method` - Calculate shipping options
- `POST /api/checkout/payment-intent` - Create payment intent (Stripe)
- `POST /api/orders` - Create final order
- `GET /api/orders/[id]` - Retrieve order details
- `POST /api/orders/[id]/cancel` - Cancel order (if allowed)

### Supabase Integration
- Tables to utilize/update:
  * `public.orders` - Main order record
  * `public.order_items` - Line items
  * `public.profiles` - User info (if logged in)
  * *Optional*: `public.addresses` - Address book
  * *Optional*: `public.payments` - Payment records

### Order Number Generation
Format: `IK-YYYYMMDD-HHMMSS-RAND`
- IK: Store identifier
- YYYYMMDD: Date
- HHMMSS: Time (to prevent collisions)
- RAND: Random 4-6 alphanumeric characters

### Payment Processing (Stripe Recommended)
1. Create PaymentIntent on server with order amount
2. Collect payment details client-side (Elements or Checkout)
3. Confirm payment with client secret
4. Handle webhooks for payment success/failure
5. Create order record only after payment confirmation
6. Send order confirmation email

### Webhook Handling (for Stripe)
- `payment_intent.succeeded` → Mark order as paid, initiate fulfillment
- `payment_intent.payment_failed` → Notify user, allow retry
- `charge.refunded` → Update order status, notify user
- `customer.subscription.updated` → For future subscriptions

### Email Notifications
- Order confirmation (immediate)
- Shipping confirmation (when shipped)
- Delivery confirmation (when delivered)
- Review request (7 days post-delivery)

## 6. Accessibility & Responsiveness

### Accessibility Standards
- WCAG 2.1 AA compliance
- All form fields properly labeled
- Error messages announced via ARIA-live
- Keyboard navigable flow
- Sufficient color contrast (4.5:1 minimum)
- Focus visible indicators
- ARIA progress bar for step indicator
- Live regions for dynamic updates (cart totals)

### Responsiveness Breakpoints
- **Mobile (<640px)**:
  * Full-width form fields
  * Stacked sections
  * Large touch targets (48x48px minimum)
  * Vertical step indicator
  * Checkout full height scrollable
  
- **Tablet (640px-1024px)**:
  * Form fields: 100% width or 50% for side-by-side (name fields)
  * Horizontal step indicator possible
  * Modal for payment card entry (optional)
  
- **Desktop (>1024px)**:
  * Two-column layout: Form (70%) | Order Summary (30%)
  * Order Summary sticky on scroll
  * Horizontal step indicator
  * Wider form fields with appropriate max-widths

### Performance Optimizations
- Debounce form validation (300ms)
- Lazy-load address validation APIs
- Prefetch common data (states, shipping options)
- Optimistic UI updates for better perceived performance
- Minimize re-renders with useMemo/useCallback

## 7. Edge Cases & Special Scenarios

### Cart Changes During Checkout
- If cart modified during checkout: Warn user, offer to refresh cart
- If item goes out of stock: Block checkout, show notification
- If price changes: Honor cart price or update with notice
- Auto-apply time-limited promotions

### Payment Failures
- Clear error messages: "Card declined", "Insufficient funds"
- Allow retry with same or different payment method
- Save cart for return attempt
- Network error handling: "Connection lost, please try again"

### Address Issues
- Invalid address detection and correction suggestions
- Service area validation (for same-day/Express)
- Military/APO/FPO address handling (if applicable)
- PO Box restrictions (if any couriers don't deliver)

### Legal & Compliance
- Tax calculation based on location (if applicable)
- VAT/GST inclusion/exclusion clarity
- Refund policy links prominent
- Terms of service versioning and acceptance tracking
- Data retention and GDPR compliance

## 8. UI/UX Best Practices from Design Skill

### Applied Principles:
- **Clear spacing**: 4px/8px/16px grid system consistently applied
- **Typography hierarchy**: Clear visual weight progression (title > subtitle > body > caption)
- **Visual hierarchy**: Primary actions stand out, secondary recede
- **Product-focused layouts**: Order summary shows actual products with thumbnails
- **States included**: Loading, empty, error, success, validation states all designed
- **Accessible forms**: Every input has associated label, clear error messaging
- **Trust signals**: Security badges, clear policies, transparent pricing, guarantees
- **Customer-friendly CTAs**: Action-oriented, benefit-focused button text

## Implementation Priority
1. Checkout context/state management
2. Step 1: Contact Information form
3. Step 2: Shipping Address form
4. Step 3: Shipping Method selection
5. Step 4: Payment Method selection + forms
6. Step 5: Order Review summary
6. Step 6: Order Confirmation page
7. Form validation and error handling
8. Progress saving and recovery
9. Mobile optimizations and touch targets
10. Accessibility compliance
11. Integration with cart and payment systems
12. Testing edge cases and edge scenarios

## Next Steps After Design
1. Create checkout context and hooks
2. Implement each step as reusable components
3. Build stepper/navigation component
4. Create order summary components
5. Integrate with existing cart system
6. Set up payment provider integration (Stripe recommended)
7. Implement order creation in Supabase
8. Add email confirmation system
9. Test all flows and edge cases
10. Optimize performance and accessibility