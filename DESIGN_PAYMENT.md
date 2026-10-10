# IK Electronics - Payment Integration Design

## Design Principles (from ui-ux-design skill)
- Design around IK Electronics and Gadgets, not a generic AI-looking store
- Prioritize mobile-first responsive design with strong desktop and tablet support
- Use clear spacing, typography hierarchy, visual hierarchy, and product-focused layouts
- Include loading, skeleton, error, empty, confirmation, and success states
- Make forms accessible and easy to complete
- Use trust signals, clear pricing, availability, delivery information, and customer-friendly CTAs

## Payment Integration Overview

This document covers the payment processing system for IK Electronics, focusing on:
- Payment method selection and processing
- Secure payment handling
- Fraud prevention
- Refunds and dispute handling
- Payment reconciliation
- Integration with checkout and order systems

## 1. Recommended Payment Provider: Stripe

### Why Stripe for IK Electronics?
- Excellent developer documentation and APIs
- Strong security and PCI DSS compliance
- Good support for African/Nigerian payment methods
- Scalable from startup to enterprise
- Robust fraud prevention (Radar)
- Excellent dashboard and reporting
- Supports subscriptions (for future)
- Good settlement times to Nigerian banks

### Alternative Providers (for consideration)
- PayStack (Nigerian-focused, good local support)
- Flutterwave (Pan-African, multiple currency support)
- Opay/PalmPay (popular local wallets)
- Interswitch/WebPay (established Nigerian provider)

## 2. Payment Architecture Overview

```
[Customer] 
    ↓ (Payment Details via Stripe Elements or Checkout)
[Frontend (Next.js)]
    ↓ (Create Payment Intent)
[Backend API Route (/api/payment/create-intent)]
    ↓ (Secure key usage)
[Stripe API]
    ↓ (Client Secret)
[Frontend]
    ↓ (Confirm Payment)
[Stripe (JS SDK)]
    ↓ (Success/Failure)
[Frontend]
    ↓ (Verify Payment)
[Backend API Route (/api/payment/verify)]
    ↓ (Webhook verification)
[Stripe Webhook]
    ↓ (Events: payment_succeeded, payment_failed)
[Backend API Route (/api/webhooks/stripe)]
    ↓ (Update order status, trigger fulfillment)
[Database (Supabase)]
    ↓ (Order management system)
[Email Service]
    ↓ (Order confirmation, shipping updates)
```

## 3. Payment Flow Detailed Design

### A. Payment Intent Creation (Server-Side)
```
[Trigger]: User clicks "Place Order" on checkout review step
[Process]:
1. Validate cart is not empty
2. Calculate order total (items + shipping + tax - discount)
3. Convert to smallest currency unit (kobo for NGN, cents for USD)
4. Create PaymentIntent with:
   - amount: total_in_kobo
   - currency: "ngn" (Nigerian Naira)
   - automatic_payment_methods: {"enabled": true}
   - description: "IK Electronics Order #IK-[timestamp]"
   - metadata: {
        order_id: "temp_order_id",
        user_id: "user_id_if_logged_in",
        items_count: X
      }
   - receipt_email: customer_email
5. Return client_secret to frontend
[Security]:
- Never expose secret key to client
- Validate amount matches cart total
- Use idempotency key to prevent duplicate intents
```

### B. Client-Side Payment Collection
```
[UI]: Payment Form Section (from checkout design)
[Options]:
1. Stripe Elements (PCI SAQ-A compliant, customizable)
2. Stripe Checkout (Pre-built, hosted, easiest)
3. Payment Request Button (Apple Pay/Google Pay)

[Recommended for IK Electronics]: Stripe Elements
- Reason: Custom look/feel, matches brand, embedded in checkout

[Elements Implementation]:
- CardElement: Complete card form (number, expiry, CVV)
- Ideal for: Credit/debit card payments
- Features: 
  * Automatic formatting
  * Brand detection (Visa, Mastercard, Verve, etc.)
  * Input validation
  * Accessibility built-in
  * iOS/Android autofill support
  * 3D Secure 2 handling
  * NFC/Apple/Google Pay support (where available)

[Alternative]: Payment Request Button
- Shows: Apple Pay, Google Pay, Saved in browser
- Appearance: Black/white button with payment logos
- Best for: Mobile users with device wallets
```

### C. Payment Confirmation & Handling
```
[Process]:
1. User submits payment details via Elements
2. Frontend calls stripe.confirmCardPayment() with client_secret
3. Stripe handles:
   * 3D Secure authentication (if required)
   * Bank authorization
   * Fraud checks (Radar)
4. Result:
   * success: payment_confirmed → redirect to order verification
   * failure: display error message with specific reason
   * requires_action: handle 3D secure redirect
[Error Handling]:
- Card declined: Show specific reason (insufficient funds, expired, etc.)
- Expired card: Prompt to update card
- Incorrect CVV: Allow retry with CVV focus
- 3D Secure required: Show authentication modal
- Network error: Retry option with exponential backoff
[Security]:
- Use Stripe.js v3 (latest)
- Enable strict mode for additional protections
- Referrer validation in dashboard
```

### D. Payment Verification (Server-Side)
```
[After client-side confirmation]:
1. Frontend sends payment_intent_id to /api/payment/verify
2. Backend retrieves PaymentIntent from Stripe using secret key
3. Verify:
   * PaymentIntent.id matches sent id
   * amount matches expected order total
   * currency is "ngn"
   * status is "succeeded"
   * metadata matches order
   * receipt_email matches customer
4. If valid: Mark order as paid in database
5. If invalid: Log attempt, notify user of verification failure
[Idempotency]:
- Verify endpoint should be safe to call multiple times
- Use database lock or status check to prevent double processing
```

### E. Webhook Handling (Critical for Reliability)
```
[Purpose]: Handle asynchronous events from Stripe
[Why needed]: 
- Payment confirmation can happen off-session
- Refunds, disputes, failed payments need handling
- Customer might close browser after payment but before redirect

[Key Webhooks to Handle]:
1. payment_intent.succeeded
   - Action: Mark order as paid, trigger fulfillment
   - Idempotency: Check if order already marked paid
   
2. payment_intent.payment_failed
   - Action: Mark order as payment_failed, notify user
   - Include: Failure reason from Stripe
   
3. charge.refunded
   - Action: Update order status to refunded/partially_refunded
   - Trigger: Inventory restock if applicable
   
4. charge.dispute.created
   - Action: Flag order for review, gather evidence
   - Notification: Alert store owner
   
5. customer.subscription.* (for future)
   - Action: Handle subscription lifecycle

[Implementation]:
- Endpoint: /api/webhooks/stripe
- Verify: Stripe signature using webhook secret
- Process: Parse event, switch on type, handle accordingly
- Respond: 200 OK quickly, do async processing
- Logging: All webhook events for audit trail
[Security]:
- Never trust client-side payment status
- Always verify via webhook or server-side check
- Rate limit webhook endpoint
- IP allowlist Stripe webhook IPs (optional but recommended)
```

## 4. Payment Methods to Support

### Primary: Card Payments (Visa, Mastercard, Verve)
- Currencies: NGN (Nigerian Naira)
- Features: 
  * 3D Secure 2 authentication
  * Tokenization for future one-click
  * Automatic currency conversion if needed
  * Support for international cards (with fees)

### Local Payment Methods (via Stripe)
1. **USSD Banking Codes**
   - Works with all Nigerian banks
   - Customer dials USSD code from phone
   - Payment confirmed via bank notification
   - Good for customers without cards

2. **Bank Transfer (Virtual Accounts)**
   - Unique bank account number per order
   - Customer transfers from their bank app
   - Automatic matching via amount/reference
   - Lower fees than card processing

3. **Wallet Payments (Future)**
   - OPay, PalmPay, Paga integration
   - QR code scanning
   - Instant confirmation

### Payment Method Selection UI
```
[In Payment Step of Checkout]
[Title]: "Choose Payment Method"
[Subtitle]: "Select how you'd like to pay"

[Method Cards]:
[1. Card Payment]
- Icon: Credit card symbol
- Title: "Credit/Debit Card"
- Description: "Visa, Mastercard, Verve"
- [If storing]: "Save this card for future purchases" (checkbox)
- [Badge]: "Most popular" (if applicable)

[2. Bank Transfer]
- Icon: Bank building
- Title: "Bank Transfer"
- Description: "Pay from your bank app"
- Details: "Unique account number generated per order"
- [Badge]: "Lower fees" (if applicable)

[3. USSD Payment]
- Icon: Mobile phone
- Title: "USSD/Bank Code"
- Description: "Dial code from your phone"
- Works with: All Nigerian banks
- [Badge]: "No card needed"

[4. QR Code Payment] (Future)
- Icon: QR code
- Title: "Scan to Pay"
- Description: "Use OPay, PalmPay, or banking app"
- [Badge]: "Instant confirmation"

[Selected State]:
- Border: 2px solid primary color
- Background: 50% opacity primary color
- Checkmark icon inside
```

## 5. Security & Compliance Measures

### PCI DSS Compliance
- **SAQ A-EP**: If using Stripe Elements (card data never touches our server)
- **SAQ A**: If using Stripe Checkout (fully hosted)
- Never store raw card data on our servers
- Use Stripe tokens and payment methods for future transactions

### Data Protection
- TLS 1.2+ for all connections
- Environment variables for secret keys
- Regular dependency auditing
- Content Security Policy headers
- Protection against XSS, CSRF

### Fraud Prevention (Stripe Radar)
- Enable: Default rule set
- Custom rules: 
  * Block high-risk countries (if applicable)
  * Velocity checks (multiple cards/IP)
  * Suspicious email domains
  * Address mismatch checks
- Review: Manual review queue for borderline cases
- Refund abuse prevention

### Additional Security
- Idempotency keys for all payment operations
- Request signing for webhooks
- API key rotation procedures
- Access logging and monitoring
- Regular security assessments

## 6. Currency & Localization

### Currency Handling
- Primary: NGN (Nigerian Naira)
- Display format: ₦1,500.00
- Smallest unit: kobo (100 kobo = 1 NGN)
- Stripe amount: integer in kobo
- Conversion: Only if accepting multiple currencies (future)

### Localization Considerations
- Language: English (primary), potential for Hausa/Yoruba/Igbo
- Phone number format: +234 XXX XXX XXXX
- Address format: Nigerian standard
- Date format: DD/MM/YYYY
- Currency symbol placement: ₦ before amount
- Postal code: 6 digits

### Tax Handling (if applicable)
- VAT: Currently 7.5% in Nigeria (verify current rate)
- Display: Show tax breakdown in order summary
- Calculation: Based on shipping destination
- Exemptions: Export orders, certain product types
- Reporting: VAT collection and remittance tracking

## 7. Refunds & Returns Processing

### Refund Types
1. **Full Refund**: Return of entire order amount
2. **Partial Refund**: Return of portion (damaged items, etc.)
3. **Store Credit**: Future purchase credit (alternative to refund)

### Refund Flow
```
[Customer Request]
    ↓
[Initiate Refund] (Admin Dashboard or API)
    ↓
[Stripe Refund Creation]
    ↓ (amount, reason, refund_to_original_method)
    ↓
[Stripe Processing] (5-10 business days typically)
    ↓
[Webhook: charge.refunded]
    ↓
[Update Order Status] (refunded/partially_refunded)
    ↓
[Inventory Restock] (if applicable)
    ↓
[Customer Notification] (email: "Your refund of ₦X has been processed")
```

### Refund UI (Admin Dashboard)
- Button: "Refund Order" on order detail page
- Modal: 
  * Amount to refund (default: full)
  * Reason dropdown: Damaged, Wrong item, Changed mind, etc.
  * Restock inventory: Checkbox (default checked)
  * Notes: Text area for internal notes
- Confirmation: "Are you sure you want to refund ₦X?"
- Processing state: Show spinner
- Success: "Refund initiated. Customer will see funds in 5-10 days."

## 8. Payment Analytics & Reporting

### Key Metrics to Track
- Conversion rate: Checkout → Payment success
- Average order value (AOV)
- Payment method distribution
- Failure rate and reasons
- Refund rate and reasons
- Dispute rate
- Processing time (payment to confirmation)
- Revenue by day/week/month
- Failed payment recovery rate

### Dashboard Components
- Real-time payment feed
- Daily revenue chart
- Payment method pie chart
- Failure reason breakdown
- Refund and dispute tracking
- Upcoming payouts schedule
- Failed payments requiring action

### Reports
- Daily settlement report
- Monthly financial summary
- Tax collection report (for VAT)
- Chargeback/dispute report
- Payment method performance

## 9. Technical Implementation Details

### Environment Variables Required
```
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Frontend only
STRIPE_SECRET_KEY=sk_test_...                  # Backend only (server)
STRIPE_WEBHOOK_SECRET=whsec_...                # For webhook verification

# Optional: For multiple environments
# STRIPE_LIVE_PUBLISHABLE_KEY=
# STRIPE_LIVE_SECRET_KEY=
```

### API Routes to Implement
```
POST /api/payment/create-intent
  - Body: { amount, currency, customer_email, metadata }
  - Returns: { client_secret, payment_intent_id }

POST /api/payment/verify
  - Body: { payment_intent_id }
  - Returns: { success: true/false, order_id }

POST /api/webhooks/stripe
  - Headers: Stripe-Signature
  - Body: Raw payload
  - Returns: 200 OK (if verified)

GET /api/payment/methods
  - Returns: Available payment methods for customer region
```

### Supabase Schema Enhancements
```
-- Add to existing orders table or create new payments table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',  -- pending, paid, failed, refunded
ADD COLUMN IF NOT EXISTS amount_paid INTEGER,  -- in kobo
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'ngn';

-- Optional: Separate payments table for detailed tracking
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id),
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_charge_id TEXT,
    amount INTEGER,  -- in kobo
    currency TEXT,
    payment_method TEXT,
    status TEXT,  -- pending, succeeded, failed, refunded
    failure_code TEXT,
    failure_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Frontend Components to Create
1. **PaymentElementWrapper**: Encapsulates Stripe Elements
2. **PaymentMethodSelector**: Radio buttons for payment method choice
3. **CardFormElement**: Stripe CardElement with loading/error states
4. **PaymentSuccess**: Confirmation animation after payment
5. **PaymentError**: Display specific error messages with retry options
6. **USSDInstructions**: Display USSD code and instructions
7. **BankTransferDetails**: Show virtual account details

### Stripe Configuration Checklist
- [ ] Activate NGN currency in dashboard
- [ ] Set up webhook endpoints (test and live)
- [ ] Configure email receipts (customize with brand)
- [ ] Set up automatic tax calculation (if needed)
- [ ] Configure Radar fraud rules
- [ ] Set up payout schedule to Nigerian bank
- [ ] Add IK Electronics logo to checkout page
- [ ] Configure custom colors to match brand
- [ ] Set up statement descriptor ("IK*ELECTRONICS")
- [ ] Enable desired payment methods (card, USB, bank transfer)
- [ ] Set up refund reasons and categories

## 10. Testing Strategy

### Test Cards (Stripe Test Mode)
- 4242424242424242: Success
- 4000002500003155: Requires 3D Secure
- 4000000000009995: Insufficient funds
- 4000000000000002: Generic decline
- 4000000000000119: Expired card
- 4000000000000127: Incorrect CVC

### Test Scenarios
1. **Successful Payment**
   - Add items to cart
   - Go through checkout
   - Enter valid test card
   - Verify order marked as paid
   - Check email confirmation sent
   - Verify inventory decremented
   
2. **Failed Payment (Insufficient Funds)**
   - Attempt payment with failing card
   - Verify error message displayed
   - Verify order remains unpaid
   - Verify cart preserved for retry
   
3. **3D Secure Flow**
   - Use card requiring authentication
   - Complete 3D secure challenge
   - Verify successful payment
   
4. **Webhook Testing**
   - Trigger stripe CLI webhook events
   - Verify order status updates
   - Check idempotency (duplicate webhooks)
   
5. **Refund Process**
   - Create test order
   - Initiate full/refund partial
   - Verify status change
   - Check inventory restock
   - Verify customer notification
   
6. **Edge Cases**
   - Network interruption during payment
   - Browser close after payment but before redirect
   - Duplicate form submissions
   - Invalid amounts (negative, zero)
   - Expired payment intents

### Testing Tools
- Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Test mode vs live mode toggling
- Automated tests (Cypress/Playwright) for checkout flow
- Manual testing with real test cards
- Load testing for high-volume scenarios

## 11. Future Enhancements & Roadmap

### Phase 1: Launch (MVP)
- Card payments via Stripe Elements
- Bank transfer via virtual accounts
- Basic webhook handling
- Email confirmations

### Phase 2: Local Payment Methods
- USSD payment integration
- QR code payments (OPay/PalmPay)
- Store credit system

### Phase 3: Advanced Features
- Saved payment methods (tokenization)
- One-click checkout for returning users
- Installment payments (Buy Now, Pay Later)
- Multi-currency support
- Subscription model (for service plans)

### Phase 4: Optimization
- Advanced fraud rule tuning
- A/B testing checkout flows
- Payment method optimization (smart routing)
- Dynamic currency conversion
- Tax automation services (TaxJar/Avalara)

## 12. UI/UX Best Practices Applied

### From ui-ux-design skill:
- **Clear spacing**: Consistent spacing in payment forms and sections
- **Typography hierarchy**: Clear distinction between field labels, inputs, help text
- **Visual hierarchy**: Primary payment methods stand out, secondary recede
- **Product-focused layouts**: Order summary shows actual items being paid for
- **States included**: Loading, empty, error, success, validation states for payment flow
- **Accessible forms**: Every input has associated label, clear error messaging, proper ARIA attributes
- **Trust signals**: Security badges, SSL icons, clear policies, guarantees, recognized payment logos
- **Customer-friendly CTAs**: Action-oriented button text ("Pay Securely", "Complete Purchase")

### Payment-Specific UX Best Practices
- **Progressive disclosure**: Show payment form only after method selected
- **Inline validation**: Real-time feedback as user types card details
- **Error prevention**: Format inputs correctly, prevent invalid characters
- **Recovery options**: Clear paths to fix errors (try different card, use bank transfer)
- **Trust building**: Show security certificates, explain why information is needed
- **Mobile optimization**: Large touch targets, appropriate keyboards, minimal typing
- **Transparency**: Show all fees upfront, no surprises at final step
- **Confirmation**: Clear success state with next steps, not just a redirect