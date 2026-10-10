# IK Electronics - Authentication & User Accounts Design

## Design Principles (from ui-ux-design skill)
- Design around IK Electronics and Gadgets, not a generic AI-looking store
- Prioritize mobile-first responsive design with strong desktop and tablet support
- Use clear spacing, typography hierarchy, visual hierarchy, and product-focused layouts
- Include loading, skeleton, error, empty, confirmation, and success states
- Make forms accessible and easy to complete
- Use trust signals, clear pricing, availability, delivery information, and customer-friendly CTAs

## 1. Sign-Up Page

### Purpose
Allow new users to create an account using email/password or social login (Google)

### Layout & Components
```
Mobile-First Layout (Single Column):
------------------------------------
[Header: IK Electronics Logo + Back Arrow]
[Main Card: White background, rounded, shadow]
  - Title: "Create Account" (font-display, text-3xl)
  - Subtitle: "Join IK Electronics to track orders, save favorites, and get exclusive offers"
  
  [Form Section]
  - Email Input: Label, Input (with email icon), placeholder, validation
  - Password Input: Label, Input (password type, toggle visibility), placeholder, validation
  - Confirm Password Input: Label, Input (password type, toggle visibility), placeholder, validation
  
  [Divider or Social Separator]
  - Text: "Or continue with"
  
  [Social Login Button]
  - Google Button: Icon + Text "Continue with Google"
    - Background: White, Border: 1px solid #e2e8f0, Text: Black
    - Hover: Background: #f8fafc
  
  [Terms & Conditions]
  - Checkbox: "I agree to the Terms of Service and Privacy Policy"
  - Link: Terms of Service (blue, underline on hover)
  - Link: Privacy Policy (blue, underline on hover)
  
  [Submit Button]
  - Full width: "Create Account" (primary button variant)
  
[Footer: Text]
  - "Already have an account? Sign In"
  - Link: "Sign In" (navigates to /login)

### States & Interactions
- Loading State: Show spinner on submit button when processing
- Success State: Show confirmation message, auto-redirect to profile setup or homepage after 2s
- Error State: Show error message below form or inline with field (red text)
- Form Validation:
  * Email: Required, valid email format
  * Password: Required, min 8 characters, at least 1 letter and 1 number
  * Confirm Password: Must match password field
  * Terms: Must be checked

### Accessibility
- Proper label associations with inputs
- Error messages announced via ARIA-live
- Keyboard navigable tab order
- Sufficient color contrast (WCAG AA)
- Focus indicators visible

### Desktop & Tablet Adaptations
- Tablet (768px+): Card width 90% max-width 400px, centered
- Desktop (1024px+): Card width 90% max-width 400px, centered
- Optional: Two-column layout on large screens (form on left, benefits/image on right)

### Trust Signals
- Security badge/icon near password field
- Privacy assurance text below form
- Social proof: "Join 5,000+ satisfied customers"

## 2. Enhanced Sign-In Page (Improving Existing)

### Current State Analysis
Existing login only has Google OAuth. We'll enhance to include email/password option.

### Layout & Components
```
[Header: IK Electronics Logo + Back Arrow]
[Main Card: White background, rounded, shadow]
  - Title: "Sign In to Your Account" (font-display, text-3xl)
  - Subtitle: "Access your orders, wishlist, and profile"
  
  [Form Section - Email/Password]
  - Email Input: Label, Input, placeholder
  - Password Input: Label, Input (password type, toggle visibility), placeholder, "Forgot password?" link
  
  [Submit Button]
  - Full width: "Sign In" (primary button variant)
  
  [Divider or Social Separator]
  - Text: "Or continue with"
  
  [Social Login Button]
  - Google Button: Icon + Text "Continue with Google"
    - Background: White, Border: 1px solid #e2e8f0, Text: Black
    - Hover: Background: #f8fafc
  
[Forgot Password Flow]
  - Link: "Forgot password?" (navigates to /forgot-password)
  
[Footer: Text]
  - "Don't have an account? Create Account"
  - Link: "Create Account" (navigates to /register)

### Enhanced Features
- Email/Password authentication alongside Google OAuth
- "Remember me" checkbox (optional)
- Forgot password flow with email reset
- Better visual hierarchy and spacing

## 3. Profile Management Page

### Purpose
Allow users to view and update their profile information, addresses, and preferences

### Layout & Components
```
[Header: Back Arrow + Title: "Profile"]
[Main Content Area: Two-column layout on desktop, single column on mobile]

[Left Column / Profile Section (Mobile: Full width)]
  - Title: "Account Information"
  - [Profile Card]
    - Avatar: Circular placeholder or user image upload
    - Name: Display name (editable inline or via edit button)
    - Email: Display email (non-editable, shows it's linked to account)
    - Phone: Input field (editable)
    - [Edit Button] [Save Button] (toggle edit/save state)
    
  - Title: "Addresses"
  - [Address Card]
    - Label: "Shipping Address"
    - [Add New Address Button] (+ icon)
    - [Existing Address Cards if any]:
      * Name, Street, City, State, ZIP, Country
      * [Edit] [Delete] [Set as Default] buttons
      * Default badge if applicable
  
  - Title: "Payment Methods" (for future integration)
    - Placeholder: "Saved payment methods will appear here"
    - [Add Payment Method Button]

[Right Column / Order History (Mobile: Hidden or accordion below)]
  - Title: "Order History"
  - [If orders exist]:
    - Order Cards: Order #, Date, Status, Total, [View Details] button
    - Status indicators: Pending (yellow), Processing (blue), Shipped (purple), Delivered (green), Cancelled (red)
  - [If no orders]:
    - Empty State: Icon + "No orders yet" + "Start shopping" button (links to /products)

### States & Interactions
- Edit Mode: Toggle between view and edit for each section
- Loading States: Spinners when saving or fetching data
- Success States: Toast notifications for saved changes
- Error States: Inline validation errors

### Data Persistence
- Uses Supabase `profiles` table for:
  * full_name, phone, avatar_url
- Addresses stored in JSONB field or separate addresses table (future enhancement)

### Accessibility & Responsiveness
- Mobile: Single column stack
- Tablet: Two columns (profile 60%, orders 40%)
- Desktop: Two columns (profile 40%, orders 60%) or (profile 33%, orders 33%, wishlist 33% if added)
- All form elements properly labeled
- Focus management when toggling edit states

## 4. Admin Access Setup (Configuration Task)

### Purpose
Grant administrative privileges to IK (business owner) for managing the store

### Implementation Steps
1. **Identify User Email**: IK's business email used for Google/Supabase login
2. **Update Database**: Set `is_admin = true` in `public.profiles` table for that email
3. **Verify Access**: Test that admin can access /admin routes
4. **Document Process**: Create guide for future admin additions

### Technical Implementation
SQL Query to run in Supabase:
```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'ik@example.com';  -- Replace with actual email
```

### Alternative: Self-Service Admin Request
Future enhancement: Allow users to request admin access, which requires approval from existing admin.

### Security Notes
- Admin privileges checked via Supabase RLS policies and `is_admin()` function
- Admin routes protected by server-side checks
- Regular audits of admin accounts recommended

## 5. Additional Authentication Pages

### Forgot Password Page
- Email input field
- Submit button: "Send Reset Link"
- Success message: "If an account exists with that email, you'll receive a reset link"
- Link: "Remember your password? Sign In"

### Reset Password Page (via email link)
- Token validation from URL
- New password input
- Confirm new password input
- Submit button: "Reset Password"
- Success message: "Password reset successful. You can now sign in."
- Link: "Sign In"

### Email Verification Page (Optional)
- For email/password auth: Verify email on sign-up
- Shows: "We've sent a verification email to [email]"
- Button: "Resend Verification Email"
- Auto-redirect when verified
```

## Implementation Notes for Supabase Integration

### Authentication Methods to Support
1. **Email/Password** (via Supabase Auth)
2. **Google OAuth** (already implemented)
3. **Optional**: Apple, Facebook, etc. (future)

### Supabase Tables Utilized
- `auth.users` (managed by Supabase Auth)
- `public.profiles` (extended user data)
- RLS policies already in place for profiles

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

### API Routes to Create/Enhance
- `/api/auth/register` (endpoint for email/password signup)
- `/api/auth/reset-password` (password reset handling)
- `/api/auth/profile` (profile CRUD operations)

## Next Steps After Design Approval
1. Implement Sign-Up page (`/register`)
2. Enhance existing Sign-In page (`/login`)
3. Implement Profile Management page (`/profile`)
4. Set up admin access via SQL update
5. Create Forgot Password and Reset Password flows
6. Connect all to Supabase backend
```
