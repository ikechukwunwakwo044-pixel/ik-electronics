# IK Electronics - Admin Dashboard Design

## Design Principles (from ui-ux-design skill)
- Design around IK Electronics and Gadgets, not a generic AI-looking store
- Prioritize mobile-first responsive design with strong desktop and tablet support
- Use clear spacing, typography hierarchy, visual hierarchy, and product-focused layouts
- Include loading, skeleton, error, empty, confirmation, and success states
- Make forms accessible and easy to complete
- Use trust signals, clear pricing, availability, delivery information, and customer-friendly CTAs

## Admin Dashboard Overview

The admin dashboard is the business owner's (IK's) control center for managing:
- Product catalog and inventory
- Orders and fulfillment
- Customer information
- Sales analytics and reporting
- Store settings and configurations

## 1. Dashboard Architecture

### Access Control
- Only accessible to users with `is_admin = true` in profiles table
- Redirect non-admin users to homepage with error message
- Super admin vs regular admin roles (future enhancement)

### Layout Structure
```
[Admin Layout]
- Fixed header: Logo + Navigation + User menu
- Fixed sidebar: Collapsible navigation menu
- Main content area: Dynamic based on selected route
- Footer: Optional (version, copyright, links)

[Responsive Behavior]
- Mobile (<640px): 
  * Sidebar converts to bottom navigation drawer
  * Header height reduced
  * Main content full width
  
- Tablet (640px-1024px):
  * Sidebar: Collapsible (icon only when collapsed)
  * Main content: Full width when sidebar collapsed
  
- Desktop (>1024px):
  * Sidebar: Fixed width (240px collapsed, 260px expanded)
  * Main content: Fluid width
```

### Navigation Structure
```
Dashboard (Overview)
├── Products
│   ├── All Products
│   ├── Add Product
│   └── Categories
├── Orders
│   ├── All Orders
│   └── Order Details
├── Customers
│   ├── All Customers
│   └── Customer Details
├── Inventory
│   ├── Stock Levels
│   └── Low Stock Alerts
├── Analytics
│   ├── Sales Overview
│   ├── Product Performance
│   └── Customer Insights
├── Settings
│   ├── General
│   ├── Payment Methods
│   ├── Shipping
│   ├── Taxes
│   └── Notifications
└── Help & Support
```

## 2. Dashboard Home / Overview Page

### Purpose
At-a-glance view of store performance and key metrics

### Layout & Components
```
[Header]
- Back to store button (mobile only)
- Title: "IK Electronics Dashboard"
- User menu: Avatar + Name + Dropdown (Profile, Settings, Sign out)

[Stats Grid]
- 2 columns (mobile), 3 columns (tablet), 4 columns (desktop)
- Each stat card: Icon + Number + Label + Trend indicator

[Stat Cards]
1. Total Sales (Today)
   - Icon: Currency/trending up
   - Value: ₦1,245,000
   - Label: "Today's Sales"
   - Trend: +12% vs yesterday (green up arrow)
   
2. Orders (Today)
   - Icon: Shopping bag/list
   - Value: 24 orders
   - Label: "Orders Today"
   - Trend: +8% vs yesterday
   
3. Conversion Rate
   - Icon: Percentage/chart
   - Value: 3.2%
   - Label: "Conversion Rate"
   - Trend: +0.5% vs yesterday
   
4. Average Order Value
   - Icon: Currency/calculator
   - Value: ₦52,000
   - Label: "Avg Order Value"
   - Trend: -5% vs yesterday
   
[Quick Actions]
- Title: "Quick Actions" (text-xl font-bold mb-4)
- Grid of action buttons:
  * [+ Add Product] (primary)
  * [Process Orders] (secondary)
  * [View Low Stock] (warning)
  * [Add Banner] (secondary)

[Recent Activity]
- Title: "Recent Activity" (text-xl font-bold mb-4)
- [If activities exist]:
  * Activity items: Icon + Description + Timestamp
  * Types: New order, Product added, Inventory updated, etc.
  * Time: "2 minutes ago", "Today 14:30", "Yesterday"
- [Else]: Empty state: "No recent activity"

[Performance Charts]
- Title: "Sales Trend" (text-xl font-bold mb-4)
- Chart: Line chart showing daily sales over last 7/30 days
- Controls: Date range selector (Today, Yesterday, Last 7 days, Last 30 days, Custom)
- Below chart: Summary stats for selected period

[Low Stock Alert]
- Title: "Low Stock Alert" (text-xl font-bold mb-4 bg-yellow-50 p-4 rounded-lg)
- [If low stock items exist]:
  * List: Product name + Current stock + Threshold + [Restock] button
  * Example: "Hisense 55\" TV - 3 left (threshold: 5)"
- [Else]: "All products above stock threshold"

[Today's Orders]
- Title: "Today's Orders" (text-xl font-bold mb-4)
- [If orders exist]:
  * Order cards: Order #, Customer, Total, Status, [Details] button
  * Status indicators: Colored dots or badges
- [Else]: "No orders today"
```

### Key Dashboard Features
- Real-time updates (via polling or websockets)
- Date range selectors for all charts
- Export functionality (CSV/PDF) for reports
- Drill-down: Click on chart elements to see detailed view
- Customizable widgets: Drag-and-drop to rearrange (future)
- Alerts: Configurable notifications for low stock, high sales, etc.

## 3. Products Management

### A. Products List Page
```
[Header]
- Back to Dashboard
- Title: "Products"
- [+ Add Product] button (primary)
- [Search] placeholder: "Search products by name, SKU, etc."
- [Filter] button: Opens filter sidebar/floating panel
- [View] toggle: Grid/List view switcher

[Filters Panel] (slides in from right or appears above grid)
- Categories: Multi-select checkboxes
- Price Range: Min/max inputs
- Stock Status: In stock, Low stock, Out of stock
- Featured: Yes/No toggle
- Published: Yes/No toggle
- Date Added: Preset ranges + custom
- [Apply] [Reset] buttons

[Products Grid]
- Responsive grid: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)
- Product Card:
  * Thumbnail: Product image (placeholder if none)
  * Name: Product title (truncate after 2 lines)
  * SKU: Small text, muted
  * Price: Current price (₦X,XXX)
  * Stock: Stock quantity + status indicator
  * Badges: Featured (if applicable), New (if <30 days old)
  * Actions: [Edit] [Delete] (icons or dropdown menu)
  * Hover: Show additional info or lift effect

[Pagination]
- Showing X-Y of Z products
- Previous / Next buttons
- Page size selector: 10, 25, 50, 100 per page

[Empty State]
- Illustration: Empty products graphic
- Title: "No products found"
- Description: "Add your first product to get started"
- Button: [+ Add Product] (primary)
```

### B. Add/Edit Product Form
```
[Form Layout]
- Back to Products list
- Title: "Add New Product" / "Edit Product: [Product Name]"
- [Delete] button (bottom, red, for edit only)
- Form tabs: Basic Info, Pricing, Inventory, Images, SEO, Variants (future)

[Tab 1: Basic Info]
- Category: Dropdown (required) + [+ Add Category] link
- Name: Text input, required, placeholder: "Product name"
- Slug: Auto-generated from name, editable, with validation
- Description: Textarea, placeholder: "Product description..."
- Tags: Input with chip interface (comma-separated or enter to add)
- Featured: Toggle switch
- Published: Toggle switch (default on)

[Tab 2: Pricing]
- Price: Number input, required, min 0, placeholder: "0.00"
  * Prefix: ₦
  * Helper: "Selling price"
- Compare At Price: Number input, min 0, placeholder: "0.00"
  * Prefix: ₦
  * Helper: "Original price (for discounts)"
- Cost Price: Number input, min 0, placeholder: "0.00"
  * Prefix: ₦
  * Helper: "Your cost (for margin calculation)"
- Currency: Dropdown (default NGN, fixed for now)
- Tax Code: Dropdown (if multiple tax rates apply)
- Margin Display: Auto-calculated and shown: "Margin: X%"

[Tab 3: Inventory]
- Track Quantity: Toggle switch (default on)
  * When off: Disable stock fields, show "Unlimited"
- Stock Quantity: Number input, min 0, default 0
- Low Stock Threshold: Number input, min 0, default 5
- Allow Backorder: Toggle switch (default off)
- SKU: Text input, placeholder: "Unique SKU (optional)"
- Barcode: Text input, placeholder: "UPC/EAN (optional)"
- Weight: Number input, unit: kg/g
- Dimensions: L x W x H inputs, unit: cm

[Tab 4: Images]
- Main Image: Large upload area with preview
  * Drag & drop or click to upload
  * Supported: JPG, PNG, WEBP
  * Max size: 5MB
  * Dimensions: Recommended 1200x1200px
  * [Remove] button on hover
- Additional Images: Gallery upload
  * Same upload area
  * Reorderable via drag handle
  * [Remove] on each image
- Alt Text: Input for each image (for accessibility/SEO)
- [+ Add Another Image] button

[Tab 5: SEO] (Optional but recommended)
- Meta Title: Input, character counter, preview snippet
- Meta Description: Input, character counter, preview snippet
- Open Graph Image: Image upload or select from product images
- Canonical URL: Auto-generated, editable
- Schema Markup: Toggle for Product schema (auto-generated)

[Tab 6: Variants] (Future enhancement)
- For products with options (size, color, etc.)
- Variant matrix generation
- Individual pricing/stock per variant

[Form Actions]
- [Cancel] (secondary button)
- [Save] (primary button) - disabled when form invalid
- [Save and Add Another] (secondary button)
- Loading state on save button
- Success: Show toast, redirect to product list or stay on edit
- Error: Show form-level or field-level errors

[Validation]
- Required fields: Category, Name, Price (if track quantity enabled)
- Price validation: Must be number >= 0
- Compare at price: If set, must be >= price
- Stock quantity: Must be integer >= 0 if tracking
- SKU: Unique if provided
- Slug: Unique, URL-safe format

[Accessibility]
- All form fields properly labeled
- Error messages associated with inputs
- Keyboard navigable tab order
- Sufficient color contrast
- Focus indicators visible
```

### C. Product Detail View (Read-only)
```
[Layout]
- Back to Products list
- Title: [Product Name]
- [Edit] button (secondary)
- [Duplicate] button (secondary)
- [Delete] button (destructive, red)

[Image Gallery]
- Main image: Large display
- Thumbnail strip: Click to change main image
- Zoom: Click to enlarge or hover zoom
- Fullscreen: Expandable view

[Product Info]
- Name: Large title
- SKU: Small text, muted
- Price: Large prominent display
  * Current: ₦X,XXX
  * Original: If discounted: line-through + "Was ₦Y,YYY"
- Stock Status: Large badge (In stock/Low stock/Out of stock)
- Description: Formatted text (supports basic HTML/markdown)
- Specs: Key-value list (two-column layout)
- Tags: Chip display

[Meta Information]
- Created: Date and time
- Updated: Date and time
- ID: Product UUID
- Views: Page view count (if tracked)
- Sales: Units sold (if tracked)

[Actions Section]
- [View Orders] button: Shows orders containing this product
- [Edit] button: Navigate to edit form
- [Duplicate] button: Copy product as new draft
- [Delete] button: With confirmation modal
```

## 4. Orders Management

### A. Orders List Page
```
[Header]
- Back to Dashboard
- Title: "Orders"
- [+ Create Order] button (primary, for manual orders)
- [Search] placeholder: "Search by order #, customer, email, etc."
- [Filter] button: Opens filter panel
- [View] toggle: Grid/List view switcher
- [Export] button: CSV export of filtered results

[Filters Panel]
- Status: Multi-select (Pending, Processing, Shipped, Delivered, Cancelled)
- Payment Status: Multi-select (Pending, Paid, Failed, Refunded)
- Date Range: Presets + custom
- Amount Range: Min/max
- Customer: Search by name/email
- Payment Method: Dropdown
- Shipping Method: Dropdown
- [Apply] [Reset] buttons

[Orders Grid/List]
- Each order as a card or row:
  * Order Number: Prominent display (IK-XXXXXX)
  * Customer: Name + [email] or [phone]
  * Date: Order date and time
  * Total: Order total amount
  * Status: Colored badge + text
  * Payment Status: Colored badge + text
  * Shipping Method: Text label
  * Actions: [Details] [Print Invoice] [More actions dropdown]

[Order Status Indicators]
- Pending: Yellow background, dark text
- Processing: Blue background, white text
- Shipped: Purple background, white text
- Delivered: Green background, white text
- Cancelled: Red background, white text
- Failed (payment): Red background, white text
- Refunded: Orange background, dark text

[Pagination]
- Standard pagination controls
- Showing X-Y of Z orders

[Empty State]
- Illustration: Empty orders graphic
- Title: "No orders found"
- Description: "Orders will appear here as customers make purchases"
- Button: [+ Create Order] (primary)
```

### B. Order Detail Page
```
[Header]
- Back to Orders list
- Title: "Order #IK-[timestamp]"
- [Print Invoice] button (secondary)
- [Copy Order Number] button (secondary)
- [More actions] dropdown: 
  * Cancel Order
  * Refund Order
  * Duplicate Order
  * Add Note
  * [If applicable]: Mark as Shipped/Delivered

[Order Info Section]
- Grid: 2 columns
- Left: Order Details
  * Order number
  * Order date/time
  * Status: Large badge with text
  * Payment status: Large badge with text
  * Fulfillment status: Text (Pending, Processing, Shipped, Delivered)
  
- Right: Customer & Contact
  * Customer name
  * Email: [mailto:link]
  * Phone: [tel:link]
  * [If logged in customer]: Link to customer profile

[Order Items Section]
- Title: "Order Items" (text-xl font-bold mb-4)
- [If items exist]:
  * Each item as a card:
    - Thumbnail: Product image (small)
    - Name: Product title
    - SKU: Small text, muted
    - Quantity: Qty x
    * Price: Unit price
    * Total: Line total (price * quantity)
    - [If variant]: Show selected options
- [Else]: "No items in order"
- Order Summary:
  * Subtotal: Label + Amount
  * Shipping: Label + Amount
  * Tax: Label + Amount (if applicable)
  * Discount: Label + Amount (if applicable)
  * Total Due: Label + Amount (prominent, font-bold text-xl)

[Shipping & Billing Section]
- Title: "Shipping Information" (text-xl font-bold mb-4)
- [If different from billing]: Show shipping address
- Title: "Billing Information" (text-xl font-bold mb-4)
- [If same as shipping]: Note: "Same as shipping address"
- [Else]: Show billing address

[Payment Section]
- Title: "Payment Information" (text-xl font-bold mb-4)
- Payment method: Text display
- Amount paid: Label + Amount
- Payment date: Timestamp (if paid)
- Transaction ID: [Copyable] text
- [If failed]: Failure reason and [Retry payment] button
- [If refunded]: Refund amount and date

[Timeline & Activity Section]
- Title: "Order Timeline" (text-xl font-bold mb-4)
- [If timeline events exist]:
  * Each event: Icon + Description + Timestamp
  * Types: Order placed, Payment confirmed, Shipped, Delivered, etc.
  * Indicator: Vertical line or connector between events
- [Else]: "No timeline activity"

[Notes Section]
- Title: "Order Notes" (text-xl font-bold mb-4)
- [If notes exist]:
  * Each note: Author + Timestamp + Content
  * [Add note] button at bottom
- [Else]: "No notes on this order"
- [Add note] button: Opens textarea modal

[Actions Footer]
- Sticky or fixed bottom bar on mobile
- Buttons: 
  * [Mark as Shipped] (primary, if applicable)
  * [Mark as Delivered] (primary, if shipped)
  * [Cancel Order] (destructive)
  * [Refund Order] (secondary)
  * [Duplicate Order] (secondary)
  * [Print Packing Slip] (secondary)
  * [Print Label] (secondary, for shipping)
```

## 5. Customers Management

### A. Customers List Page
```
[Header]
- Back to Dashboard
- Title: "Customers"
- [+ Add Customer] button (primary)
- [Search] placeholder: "Search by name, email, phone"
- [Filter] button: Opens filter panel
- [Export] button: CSV export

[Filters Panel]
- Date Registered: Presets + custom
- Last Order Date: Presets + custom
- Total Spent: Min/max
- Order Count: Min/max
- Location: State/Country (if available)
- [Apply] [Reset] buttons

[Customers Grid]
- Each customer as a card:
  * Avatar: Initials or image
  * Name: Full name
  * Email: Email address
  * Phone: Phone number
  * Location: City, State (if available)
  * Stats: Orders total, Total spent, Last order date
  * Tags: VIP, New, etc. (if implemented)
  * Actions: [View] [Edit] [More actions]

[Pagination]
- Standard controls

[Empty State]
- Illustration: Empty customers graphic
- Title: "No customers found"
- Description: "Customers will appear here as they create accounts"
- Button: [+ Add Customer] (primary)
```

### B. Customer Detail Page
```
[Header]
- Back to Customers list
- Title: [Customer Name]
- [Edit] button (secondary)
- [More actions] dropdown: 
  * Deactivate Account
  * Export Data
  * Merge Accounts (if duplicate)
  * [If applicable]: Reset Password

[Customer Info Section]
- Grid: 2 columns
- Left: Profile
  * Avatar: Large circular image or initials
  * Name: Full name display
  * Email: Email address
  * Phone: Phone number
  * Date joined: "Member since [date]"
  * Last seen: "Last active [time ago]"
  
- Right: Statistics
  * Total orders: Number
  * Total spent: Currency amount
  * Average order value: Currency amount
  * Last order: Date + "View order"
  * Conversion rate: If tracked (visits to purchase)
  
[Addresses Section]
- Title: "Addresses" (text-xl font-bold mb-4)
- [If addresses exist]:
  * Each address as a card:
    * Type: Home/Work/Other (label)
    * Name: Attribution name
    * Street: Full address
    * City, State, ZIP
    * Country
    * [Default] badge if applicable
    * Actions: [Edit] [Delete] [Set as Default]
- [Else]: "No addresses saved"
- [+ Add Address] button

[Order History Section]
- Title: "Order History" (text-xl font-bold mb-4)
- [If orders exist]:
  * Order cards: Compact version from orders list
  * Pagination or load more
- [Else]: "No order history"
- [View all orders] button: Links to filtered orders list

[Communication Section]
- Title: "Communication Preferences" (text-xl font-bold mb-4)
- Email marketing: Toggle switch
- SMS notifications: Toggle switch
- Order updates: Toggle switch
- Promotional offers: Toggle switch
- [Save Preferences] button

[Notes Section]
- Title: "Customer Notes" (text-xl font-bold mb-4)
- [If notes exist]:
  * Each note: Author + Timestamp + Content
  * [Add note] button at bottom
- [Else]: "No notes on this customer"
- [Add note] button: Opens textarea modal

[Security & GDPR Section]
- Title: "Data & Privacy" (text-xl font-bold mb-4)
- Data export: [Export Customer Data] button
- Account deletion: [Delete Account] button (destructive, with confirmation)
- Last login: Timestamp
- Login attempts: Number / Last attempt
- 2FA Status: Enabled/Disabled (if implemented)
```

## 6. Inventory Management

### A. Stock Levels Page
```
[Header]
- Back to Dashboard
- Title: "Inventory Management"
- [+ Add Stock] button (primary)
- [Import] button: CSV upload for bulk updates
- [Export] button: CSV export
- [Search] placeholder: "Search products by name or SKU"
- [Filter] button: Opens filter panel

[Filters Panel]
- Stock Status: In stock, Low stock (≤ threshold), Out of stock
- Categories: Multi-select
- Supplier: Dropdown (if supplier tracking added)
- Date Last Updated: Presets + custom
- [Apply] [Reset] buttons

[Inventory Grid]
- Each product as a row or card:
  * Thumbnail: Product image
  * Name: Product title
  * SKU: Product SKU
  * Current Stock: Number (prominent display)
  * Low Stock Threshold: Number
  * Status: 
    * In stock (> threshold): Green badge
    * Low stock (≤ threshold, > 0): Yellow badge
    * Out of stock (= 0): Red badge
  * Reserved: Number (if order reservations implemented)
  * Available: Current Stock - Reserved
  * Location: Warehouse/bin location (if multi-location)
  * Last Updated: Timestamp
  * Actions: [Edit Stock] [View History] [More actions]

[Stock Alerts Banner]
- If low stock items exist:
  * Background: Yellow-50
  * Icon: Exclamation triangle
  * Title: "Low Stock Alert"
  * Message: "[X] products below stock threshold"
  * [View Low Stock] button: Navigates to filtered view
  * [Notify Supplier] button: If supplier integration

[Empty State]
- Illustration: Empty inventory graphic
- Title: "No inventory data"
- Description: "Products will appear here as they are added to the catalog"
- Button: [+ Add Product] (primary)

[Summary Statistics]
- Total Products: Number
- Total Units in Stock: Number
- Total Value of Inventory: Currency amount (cost price * quantity)
- Average Stock Level: Number
- Products Out of Stock: Number
- Products Low Stock: Number
```

### B. Stock Adjustment Modal/Form
```
[Title]: "Adjust Stock for [Product Name]"
[Product Info]: Thumbnail + Name + SKU + Current Stock Display

[Adjustment Type]: Radio buttons
- Set to: Absolute value (default)
- Add to: Increase by amount
- Subtract from: Decrease by amount

[Fields]:
- Current Stock: Display only (read-only)
- Adjustment Amount: Number input, integer
  * Min: Depends on type (for subtract: -current_stock, for add: 1, for set: 0)
  * Max: Reasonable maximum (e.g., 10000)
- Reason: Dropdown
  * Sales return
  * Damaged goods
  * Received shipment
  * Inventory correction
  * Lost/stolen
  * Used as sample
  * Other: [text input for specification]
- Notes: Textarea (optional, for additional context)

[Validation]:
- Resulting stock cannot be negative
- Adjustment amount must be integer
- Reason required

[Actions]:
- [Cancel] (secondary)
- [Adjust Stock] (primary)
- Loading state on submit
- Success: Show toast, close modal, update inventory
- Error: Show form-level errors

[Inventory History]
- Title: "Inventory Adjustment History"
- [If adjustments exist]:
  * Each adjustment as a card:
    - Date: Timestamp
    - Type: Icon + text (Added/Subtracted/Set to)
    - Amount: Number with +/- sign
    - Reason: Text label
    - Notes: If present
    - Previous Stock: Number
    - New Stock: Number
    - User: Who made the change
- [Else]: "No inventory adjustments recorded"
- [Export History] button
```

## 7. Analytics & Reporting

### A. Sales Overview Page
```
[Header]
- Back to Dashboard
- Title: "Sales Analytics"
- [Date Range] picker: Presets + custom
- [Compare] toggle: Compare to previous period
- [Export] button: Export report

[Key Metrics Row] (Same as dashboard overview but detailed)
- Total Revenue
- Total Orders
- Average Order Value
- Conversion Rate (visits to purchase)
- Customer Acquisition Cost (if marketing tracked)
- Return Rate

[Charts Section]
[Chart 1: Sales Trend]
- Type: Line chart
- X-axis: Date (daily/weekly/monthly based on range)
- Y-axis: Revenue amount
- [If compare]: Two lines (current vs previous period)
- Metrics: Total revenue, number of orders
- Below chart: Summary stats

[Chart 2: Order Volume]
- Type: Bar chart
- X-axis: Date
- Y-axis: Number of orders
- [If compare]: Side-by-side bars
- Below chart: Avg orders per day, peak day

[Chart 3: Sales by Category]
- Type: Pie chart or Bar chart
- Shows: Revenue distribution by product category
- [If many categories]: Top 10 + "Others"
- Below chart: Table with category, revenue, percentage, YoY change

[Chart 4: Payment Method Distribution]
- Type: Pie chart
- Shows: Percentage of orders by payment method
- Below chart: Table with method, count, percentage, avg order value

[Chart 5: Shipping Method Distribution]
- Type: Pie chart
- Shows: Percentage of orders by shipping method
- Below chart: Table with method, count, percentage, avg delivery time

[Chart 6: Geographic Distribution] (If location data available)
- Type: Map or Bar chart
- Shows: Orders/revenue by state/region
- Below chart: Table with region, order count, revenue, avg order value

[Recent Orders Table]
- Title: "Recent Orders"
- Columns: Order #, Date, Customer, Amount, Status, Payment Status
- Sortable: Click column headers
- Actions: [View] link on order #
- Pagination: Standard controls
```

### B. Product Performance Page
```
[Header]
- Back to Dashboard
- Title: "Product Analytics"
- [Date Range] picker
- [Sort by]: Dropdown (Revenue, Units Sold, Views, Margin)
- [Export] button

[Top Products Section]
- Title: "Top Performing Products"
- [Metric selector]: Revenue / Units Sold / Margin
- [Time period]: Last 7 days / Last 30 days / Last 90 days / Lifetime
- Grid of product cards:
  * Thumbnail
  * Name
  * Metric value (e.g., "₦124,000 revenue")
  * Rank badge: #1, #2, #3...
  * Trend: Up/down arrow vs previous period
  * [View Details] button

[Product Details Table]
- Columns: Product, SKU, Category, Units Sold, Revenue, Margin %, Views, Conversion Rate
- Sortable on all columns
- Filter: Search by product name or SKU
- Actions: [View] [Edit] links
- Pagination: Standard controls

[Product Deep Dive] (When clicking on product)
- Title: "Performance: [Product Name]"
- [Same charts as sales overview but for this product]
- Sales trend
- Units sold trend
- Price history (if price changes tracked)
- Geographic distribution
- Customer insights (new vs returning)
- Review statistics (if reviews implemented)
```

### C. Customer Insights Page
```
[Header]
- Back to Dashboard
- Title: "Customer Analytics"
- [Date Range] picker
- [Export] button

[Customer Metrics]
- Total Customers
- New Customers (period)
- Repeat Customer Rate
- Average Order Value (per customer)
- Purchase Frequency (orders per customer)
- Customer Lifetime Value (estimated)

[Charts Section]
[Chart 1: Customer Growth]
- Type: Line chart
- X-axis: Date
- Y-axis: Number of customers
- [If compare]: Two lines
- Metrics: Total customers, new customers

[Chart 2: Order Frequency Distribution]
- Type: Histogram
- Shows: Customers by number of orders (1 order, 2 orders, 3+ orders)
- Below chart: Percentage of customers in each bucket

[Chart 3: Purchase Interval]
- Type: Bar chart or Line chart
- Shows: Average days between orders by customer cohort
- Helps understand repurchase timing

[Chart 4: Customer Segmentation]
- Type: Scatter plot or Grid
- X-axis: Average order value
- Y-axis: Order frequency
- Quadrants: 
  * High value, frequent (Champions)
  * High value, infrequent (Loyalists)
  * Low value, frequent (Regulars)
  * Low value, infrequent (At risk)
- Below chart: Table with segment, count, characteristics, recommended actions

[Chart 5: Geographic Distribution]
- Type: Map or Bar chart
- Shows: Customers by state/region
- Below chart: Table with region, customer count, avg order value, repeat rate

[Recent Customers Table]
- Title: "Recent Customers"
- Columns: Customer, Date joined, Orders total, Spent total, Last order, Status
- Sortable: All columns
- Status: New, Active, At risk, Churned (based on behavior)
- Actions: [View] [Edit] links
```

## 8. Settings Management

### A. General Settings
```
[Title]: "General Settings"
[Form Fields]:
- Store Name: Text input (default: "IK Electronics and Gadgets")
- Store Tagline: Text input
- Store Description: Textarea
- Store Logo: Image upload (recommendations: SVG or PNG, transparent background)
- Store Favicon: Image upload
- Currency: Dropdown (default NGN, locked for now)
- Timezone: Dropdown (default: Africa/Lagos)
- Date Format: Dropdown (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
- Time Format: Dropdown (24h, 12h with AM/PM)
- Week Starts On: Dropdown (Monday, Sunday)
- [Save Changes] button
```

### B. Payment Settings
```
[Title]: "Payment Settings"
[Sections]:
[1. Payment Methods]
- Toggle switches for each method:
  * Credit/Debit Cards (Stripe)
  * Bank Transfer
  * USSD Payment
  * Cash on Delivery
  * [Future]: Wallet payments (OPay, PalmPay, etc.)
  
[2. Card Payment Settings] (if cards enabled)
- Currency: Display only (NGN)
- Enable saving cards: Toggle switch
- Default currency: Display only
- Statement prefix: Text input (default: "IK*ELECTRONICS")
- Webhook status: [Connected] / [Disconnected] button to test
- Test mode: Toggle switch (with prominent warning when on)
  
[3. Bank Transfer Settings] (if enabled)
- Bank Name: Text input
- Account Name: Text input (default: IK Electronics and Gadgets)
- Account Number: Text input
- Reference format: Text input (default: "IK-[orderid]")
- Instructions: Textarea
- [Example] button: Shows sample instructions
  
[4. Cash on Delivery Settings] (if enabled)
- Availability: Radio buttons
  * Nationwide
  * Specific states only: [Multi-select states]
  * Radius from store: [Distance input] km
- Additional fee: Number input, default 0
  * Prefix: ₦
  * [If fee > 0]: "Additional charge for COD orders"
- Order limit: Number input, default 0 (0 = no limit)
  * Helper: "Maximum order value for COD (0 = no limit)"
- [Save Changes] button
```

### C. Shipping Settings
```
[Title]: "Shipping Settings"
[Sections]:
[1. Shipping Methods]
- [+ Add Shipping Method] button
- [Existing methods as cards]:
  * Title: Method name
  * Price: Amount
  * Delivery time: Estimate
  * Active: Toggle switch
  * Actions: [Edit] [Delete]
  
[2. Add/Edit Shipping Method]
- Title: "Add Shipping Method" / "Edit: [Method Name]"
- Name: Text input, required
- Price: Number input, required, min 0
  * Prefix: ₦
  * Free option: Checkbox (sets price to 0, shows "FREE" badge)
- Delivery Estimate: Text input, required
  * Examples: "3-5 business days", "Today if ordered before 2PM"
- Description: Textarea
- Availability: Same as COD settings above
- Handling Time: Number input, default 0
  * Helper: "Days to process before shipping"
- Geo-restrictions: Same as COD
- [Save Changes] button
  
[3. Shipping Rules] (Advanced)
- Free shipping threshold: Number input
  * Helper: "Free shipping on orders over ₦X,XXX"
- Flat rate per item: Number input
  * Helper: "Add ₦X per additional item"
- Weight-based rates: [Complex interface for future]
- [Save Changes] button
```

### D. Tax Settings
```
[Title]: "Tax Settings"
[Tax Configuration]:
- Enable taxes: Toggle switch
- If disabled: Show message "Taxes are currently disabled"
- If enabled:
  
[Tax Method]: Radio buttons
- Manual: Set tax rates per product/category
- Automatic: Use tax calculation service (future)
- None: No taxes applied

[Manual Tax Configuration]
- Default Tax Rate: Number input, default 0
  * Suffix: "%"
  * Helper: "Applied to all products unless overridden"
- Product Tax Overrides: Table
  * Columns: Product, Category, Tax Rate, Actions
  * [+ Add Override] button
  
[Tax Display Settings]
- Prices Include Tax: Toggle switch
  * If on: Show "Prices include tax" near prices
  * If off: Show "Plus tax" near prices
- Tax Display in Cart: Radio buttons
  * Line item: Show tax per item
  * Consolidated: Show single tax total
- [Save Changes] button
```

### E. Notifications Settings
```
[Title]: "Notification Settings"
[Sections]:
[1. Email Notifications]
- Order confirmation: Toggle switch (default on)
- Order shipped: Toggle switch (default on)
- Order delivered: Toggle switch (default on)
- Order cancelled: Toggle switch (default on)
- Refund processed: Toggle switch (default on)
- Low stock alert: Toggle switch (default off)
- New account signup: Toggle switch (default off)
- [From]: Email address input
- [Reply-to]: Email address input
- [Send test email] button
  
[2. SMS Notifications] (If integrated with SMS provider)
- Order confirmation: Toggle switch
- Order shipped: Toggle switch
- Order delivered: Toggle switch
- Low stock alert: Toggle switch
- [From]: Phone number input
- [Send test SMS] button
  
[3. Webhook Notifications] (For integrations)
- URL: Text input
- Events: Multi-select checkboxes
  * order.created
  * order.updated
  * order.shipped
  * order.delivered
  * payment.received
  * inventory.low
- [Save] button
  
[4. Slack/Teams Notifications] (Future)
- Webhook URL: Text input
- Channels: Dropdown
- Events: Multi-select
- [Save] button
  
[5. Notification History]
- Title: "Sent Notifications"
- Table: Timestamp, Type, Recipient, Status, Actions
- Actions: [View] [Resend] [Delete]
- [Export History] button
  
[Save Changes] button
```

### F. Advanced Settings
```
[Title]: "Advanced Settings"
[Sections]:
[1. API Keys]
- Stripe: [Connected]/[Disconnected] status
  * [Test] button to verify connection
  * [View logs] link
- Webhooks: URL display
- [Other integrations]: Placeholder for future
  
[2. Store Maintenance]
- Enable maintenance mode: Toggle switch
- Maintenance message: Textarea
- Allowed IPs: Text input (comma-separated, for dev access)
- [Save Changes] button
  
[3. Data Management]
- Export store data: [Export All Data] button
- Import store data: [File upload] button
- Database backup: [Create Backup] button
  * Last backup: Timestamp
  * [Schedule backups] link (future)
- [Reset all data] button: Extremely destructive, requires confirmation
  
[4. Localization]
- Language: Dropdown (English default, future: Hausa, Yoruba, Igbo)
- Date format: As in General Settings
- Number format: As in General Settings
- [Save Changes] button
  
[5. Security]
- Password policy: 
  * Minimum length: Dropdown (8, 10, 12)
  * Require special characters: Toggle switch
  * Require numbers: Toggle switch
  * Require mixed case: Toggle switch
- Session timeout: Dropdown (15 min, 1 hour, 4 hours, 8 hours)
- [Save Changes] button
  
[Save Changes] button (at bottom)
```

## 9. Help & Support Section
```
[Title]: "Help & Support"
[Sections]:
[1. Documentation]
- [Getting Started Guide] link
- [Product Management Guide] link
- [Order Processing Guide] link
- [Payment Integration Guide] link
- [Shipping Setup Guide] link
- [Analytics Guide] link
  
[2. Video Tutorials]
- [Dashboard Overview] video
- [Adding Products] video
- [Processing Orders] video
- [Managing Inventory] video
- [Viewing Reports] video
  
[3. FAQ]
- Accordion sections:
  * General Questions
  * Product Management
  * Order Processing
  * Payments & Billing
  * Shipping & Fulfillment
  * Returns & Refunds
  * Technical Issues
  
[4. Contact Support]
- Title: "Need Help?"
- Description: "Our support team is here to help you run your store successfully."
- [Live Chat] button (if implemented)
- [Email Support]: mailto:link
- [Phone Support]: tel:link
- [Support Hours]: Text (e.g., "Mon-Fri 9AM-6PM WAT")
  
[5. System Status]
- Title: "System Status"
- [Status indicator]: Green dot + "All systems operational"
- [Last updated]: Timestamp
- [View detailed status] link: To status page with:
  * API response times
  * Database status
  * Integration statuses (Stripe, email, etc.)
  * Current version number
  
[6. Legal & Compliance]
- [Terms of Service] link
- [Privacy Policy] link
- [Cookie Policy] link
- [GDPR Compliance] link
- [Accessibility Statement] link
```

## 10. Responsive Design Specifications

### Mobile (<640px)
- **Layout**: Single column, full width
- **Header**: Height reduced, hamburger menu for sidebar
- **Sidebar**: Converts to bottom navigation drawer (3-5 icons)
- **Cards**: Full width, margin bottom 16px
- **Forms**: Full width inputs, stacked vertically
- **Tables**: 
  * Horizontal scroll on small tables
  * Convert to card layout for complex tables
  * Prioritize essential columns
- **Charts**: Full width, height 200-300px
- **Touch targets**: Minimum 48x48px
- **Typography**: Base font size 16px (up from 14px)

### Tablet (640px-1024px)
- **Layout**: 
  * Sidebar: Collapsible (shows icons only when collapsed)
  * Main content: Expands when sidebar collapsed
  * Optional: Sidebar always shows icons + hover text
- **Header**: Standard height
- **Navigation**: 
  * Sidebar shows icons + tooltip on hover
  * Click to expand/collapse
- **Grids**: 
  * 2 columns for product/admin grids
  * 3 columns for dashboard stats
- **Forms**: 
  * Two-column layout for related fields (name fields, address line 1/2)
  * Full width for longer fields (address, description)
- **Tables**: 
  * Most columns visible
  * Horizontal scroll if needed
- **Charts**: 
  * Width 400-500px
  * Height 250-350px
- **Modals**: 
  * Width 90vw, max-width 500px
  * Centered

### Desktop (>1024px)
- **Layout**: Fixed sidebar + fluid main content
- **Sidebar**: 
  * Collapsed: 60px width (icons only)
  * Expanded: 260px width (icons + text)
  * Toggle button in header
- **Header**: Standard height with logo, navigation, user actions
- **Main Content**: 
  * Margin-left: Sidebar width
  * Padding: 24px
  * Max-width: None (fluid to window)
  * Optional: Max-width 1400px for very large screens
- **Navigation**: 
  * Sidebar always visible
  * Hover effects on items
- **Grids**: 
  * 3-4 columns for product/admin grids
  * 4 columns for dashboard stats (can be 6 on very wide screens)
- **Forms**: 
  * Multi-column layouts optimized for width
  * Field widths proportional to expected content
- **Tables**: 
  * Full visibility of columns
  * Column resizing (future)
  * Sorting indicators
- **Charts**: 
  * Width 600-800px
  * Height 350-450px
  * Legend positioning optimized
- **Modals**: 
  * Width: 500px (small), 700px (medium), 900px (large)
  * Max-width: 90vw
  * Centered with overlay

## 11. Accessibility Specifications

### WCAG 2.1 AA Compliance
- **Text Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **UI Components**: Minimum 3:1 for graphical objects and user interface components
- **Text Resizing**: Content works at 200% zoom
- **Keyboard Navigation**: 
  * All functionality available via keyboard
  * Logical tab order
  * Visible focus indicators
  * Skip to main content link
  * No keyboard traps
- **Forms**: 
  * All inputs have associated labels
  * Error messages associated with fields via ARIA
  * Instructions and hints provided
  * Validation errors announced
- **Non-text Content**: 
  * Alt text for all meaningful images
  * Captions/transcripts for multimedia (if used)
  * ARIA labels for icons and controls
- **Timing**: 
  * No time limits unless essential
  * Users can adjust or extend time limits
  * Moving/pausing/blinking content can be paused
- **Seizure Prevention**: 
  * No content flashes more than 3 times per second
  * No red flashing content
- **Navigable**: 
  * Multiple ways to find pages
  * Clear headings and labels
  * Focus visible and logical order
- **Input Modalities**: 
  * Functionality available via multiple input methods
  * No mouse-specific gestures required

### Specific Accessibility Features
- **Screen Reader Support**:
  * Proper landmark roles (header, nav, main, footer)
  * ARIA-live regions for dynamic updates (toasts, notifications)
  * ARIA-describedby for complex widgets
  * Logical reading order
- **Color Blindness Friendly**:
  * Don't rely on color alone to convey information
  * Use patterns, icons, text in addition to color
  * Test with deuteranopia, protanopia, tritanopia filters
- **Motor Impairments**:
  * Large touch/click targets (minimum 44x44px)
  * Sufficient spacing between interactive elements
  * Support for switch controls and voice input
- **Cognitive Accessibility**:
  * Clear and simple language
  * Consistent navigation and layout
  * Predictable interactions
  * Error prevention and recovery
  * Help and documentation available

## 12. Performance Optimizations

### Loading States
- **Skeleton Loaders**: Placeholder shapes while content loads
- **Progressive Loading**: Load critical content first, then secondary
- **Lazy Loading**: 
  * Images: Load as they enter viewport
  * Components: Load tab content when tab is activated
  * Routes: Code splitting for each major section
- **Optimistic Updates**: 
  * UI updates immediately on user action
  * Sync with backend in background
  * Rollback on failure

### Data Fetching
- **Query Optimization**: 
  * Select only needed fields
  * Use indexes effectively
  * Avoid N+1 queries (use joins or batch fetching)
- **Caching Strategy**: 
  * Short-term: React Query/SWR for server state
  * Long-term: Browser caching for static assets
  * API: Cache headers for appropriate endpoints
- **Pagination & Virtual Scroll**: 
  * Large lists: Windowing/virtual scrolling
  * Pagination: Server-side with proper caching
  * Infinite scroll: For activity feeds, not data grids

### Rendering Optimizations
- **Component Optimization**: 
  * React.memo for pure components
  * useCallback/useMemo for expensive computations
  * Virtual lists for large datasets
- **CSS Optimization**: 
  * Critical CSS inlined
  * CSS minification
  * Remove unused CSS
  * Use CSS containment where possible
- **Image Optimization**: 
  * WebP format with fallback
  * Appropriate sizing (don't scale large images down)
  * Lazy loading
  * CDN delivery
- **Font Optimization**: 
  * Subset fonts (only needed characters)
  * Preload critical fonts
  * Use font-display: swap
  * Limit font variations

### Bundle Optimization
- **Code Splitting**: 
  * Route-based splitting
  * Dynamic imports for non-critical components
  * Separate vendor and app bundles
- **Tree Shaking**: 
  * Remove unused exports
  * Side-effect free imports
- **Asset Optimization**: 
  * Compress images
  * Minify JavaScript/CSS
  * Use modern formats (AVIF if supported)
- **Preloading**: 
  * Critical resources: Preload in head
  * Fonts: Preload key fonts
  * Data: Prefetch for anticipated navigation

## 13. Security Considerations

### Authentication & Authorization
- **Route Protection**: 
  * Server-side checks on all admin routes
  * Redirect non-authenticated users to login
  * Redirect non-admin users to homepage/error
- **Session Management**: 
  * Secure cookies (HttpOnly, Secure, SameSite)
  * Session expiration and renewal
  * Invalidated on password change
  * Multi-tab handling
- **Password Security**: 
  * Hashing with bcrypt/scrypt/argon2
  * Rate limiting on login attempts
  * Password breach checking (if implemented)
  * Password reset with time-limited tokens
- **Account Enumeration**: 
  * Consistent timing for login/responses
  * Generic error messages

### Data Protection
- **Input Validation**: 
  * Validate all inputs on server-side
  * Sanitize to prevent XSS
  * Length limits on all fields
  * Type validation (string, number, date, etc.)
- **Output Encoding**: 
  * Escape HTML in dynamic content
  * Sanitize URLs for redirects
  * JSON encoding for API responses
- **Database Security**: 
  * Parameterized queries/ORM to prevent SQL injection
  * Principle of least privilege for database user
  * Regular backups and recovery testing
  * Monitoring for suspicious queries
- **File Uploads**: 
  * Validate file type (MIME + extension)
  * Limit file size
  * Store outside web root or in secure bucket
  * Scan for malware (if possible)
  * Randomize filenames

### API Security
- **Rate Limiting**: 
  * Per-IP and per-user limits
  * Different limits for different endpoints
  * Exponential backoff or retry-after headers
- **Authentication**: 
  * Verify tokens/signatures on all protected routes
  * Short expiration times
  * Refresh token rotation
- **Transport Security**: 
  * Enforce HTTPS everywhere
  * HSTS header
  * Disable weak TLS versions
  * Secure cookies
- **Information Disclosure**: 
  * Generic error messages in production
  * Detailed errors only in development
  * Hide stack traces and internal details
  * Version information hidden or minimized

### Monitoring & Logging
- **Access Logging**: 
  * Log all requests (anonymized in production)
  * Monitor for suspicious patterns
  * Alert on failed login bursts
- **Error Logging**: 
  * Capture exceptions and stack traces
  * Monitor error rates
  * Alert on error spikes
- **Audit Logging**: 
  * Log administrative actions
  * Log data exports and deletions
  * Log permission changes
  * Tamper-evident logs
- **Health Checks**: 
  * Regular endpoint health checks
  * Monitor response times
  * Alert on service degradation

## 14. Implementation Roadmap & Priorities

### Phase 1: Core Dashboard (Weeks 1-2)
- Authentication and route protection
- Dashboard overview with basic stats
- Products list and basic CRUD
- Orders list and basic CRUD
- Basic settings (general, payment, shipping)
- Responsive design for mobile/desktop

### Phase 2: Enhanced Functionality (Weeks 3-4)
- Product variants (if needed)
- Order management enhancements (notes, timeline)
- Customer management
- Inventory management
- Analytics dashboard (basic charts)
- Advanced settings (notifications, API keys)
- Accessibility compliance

### Phase 3: Advanced Features (Weeks 5-6)
- Advanced analytics and reporting
- Customer segmentation
- Inventory forecasting
- Advanced settings (tax rules, shipping rules)
- Bulk operations (import/export)
- Performance optimizations
- Extensive testing and QA
- Documentation and help content

### Phase 4: Polish & Launch (Week 7)
- User acceptance testing
- Performance benchmarking
- Security audit
- Accessibility audit
- Documentation completion
- Training materials
- Launch preparation

## 15. Technical Implementation Notes

### State Management
- **Approach**: React Context API or Zustand for global state
- **Server State**: React Query or SWR for data fetching
- **UI State**: Local component state for form states, UI toggles
- **Persistence**: localStorage for user preferences (sidebar collapse, etc.)

### API Design
- **RESTful Resources**: 
  * GET /api/admin/products
  * POST /api/admin/products
  * GET /api/admin/products/[id]
  * PATCH /api/admin/products/[id]
  * DELETE /api/admin/products/[id]
  * Similar patterns for orders, customers, etc.
- **Authentication**: 
  * Bearer token in Authorization header
  * JWT or session-based
  * Refresh token flow
- **Versioning**: 
  * /api/v1/admin/...
  * Deprecation policy
- **Filtering & Pagination**: 
  * Query parameters: ?page=1&limit=25&search=term&status=active
  * Response: { data: [...], pagination: { page, limit, total, pages } }
- **Error Handling**: 
  * Standard error format: { error: { code, message, details } }
  * HTTP status codes: 200, 201, 400, 401, 403, 404, 409, 422, 500

### Supabase Integration
- **Tables to Use/Extend**:
  * `public.profiles` - Extended with is_admin, etc.
  * `public.products` - Existing schema
  * `public.orders` - Existing schema
  * `public.order_items` - Existing schema
  * `public.addresses` - New or extended for customer addresses
  * `public.product_images` - If separating images
  * `public.inventory_logs` - Existing schema
  * `public.analytics_events` - For tracking (if implemented)
- **RLS Policies**: 
  * Admin-only access to admin tables/resources
  * Row-level security where applicable
  * Service role keys for backend operations
- **Functions**: 
  * Database functions for complex calculations
  * Triggers for audit trails
  * Search functions for full-text search

### Frontend Architecture
- **Component Organization**: 
  * /components/admin/ - Admin-specific components
  * /components/layout/ - Admin layout components (header, sidebar)
  * /components/widgets/ - Reusable widgets (charts, stats, tables)
  * /components/forms/ - Form components and fields
  * /components/hooks/ - Custom hooks for data fetching, state
- **Styling Approach**: 
  * Tailwind CSS with custom configuration
  * Headless UI or Radix UI for accessible components
  * Custom CSS for unique designs
  * CSS variables for theming
- **Routing**: 
  * Next.js App Router
  * Route groups for admin section
  * Loading states and error boundaries per route
  * Parallel routes for sophisticated layouts (future)
- **Type Safety**: 
  * TypeScript throughout
  * Generated types from Supabase (if desired)
  * Strict typing for API responses
- **Testing**: 
  * Unit tests for components and hooks
  * Integration tests for page flows
  * End-to-end tests for critical paths
  * Visual regression testing
  * Accessibility testing (axe-core, etc.)

## 16. UI/UX Design Principles Applied

### From ui-ux-design skill:
- **Clear spacing**: Consistent 4px/8px/16px/24px spacing system applied throughout
- **Typography hierarchy**: 
  * Display: 4xl-5xl for main titles
  * Heading: 2xl-3xl for section titles
  * Subheading: xl-lg for subsection titles
  * Body: base-sm for regular text
  * Caption: xs-2xs for helper text
  * Weight progression: light → regular → medium → bold → black
- **Visual hierarchy**: 
  * Primary actions: Bold, filled buttons
  * Secondary actions: Outline or ghost buttons
  * Tertiary actions: Text links
  * Important data: Larger size, bold weight
  * Secondary data: Regular size, muted colors
- **Product-focused layouts**: 
  * Product cards show actual products with images
  * Order summaries show items being managed
  * Customer views show purchase history
  * Analytics show real business metrics
- **States included**: 
  * Loading: Skeletons, spinners, placeholder content
  * Empty: Illustrations, guidance text, call-to-action buttons
  * Error: Clear messaging, recovery options, technical details for admins
  * Success: Toasts, confirmation messages, visual feedback
  * Validation: Inline field errors, form-level errors
- **Accessible forms**: 
  * Every input has associated label (visible or visually hidden)
  * Error messages linked via ARIA-describedby
  * Help text and examples provided
  * Input formatting and masking where helpful
  * Clear submission and reset actions
- **Trust signals**: 
  * Security badges and indicators
  * Clear policies and procedures
  * Transparent data handling
  * Professional and consistent branding
  * Verified credentials and certifications (displayed if applicable)
- **Customer-friendly CTAs**: 
  * Action-oriented: "Add Product", "Process Order", "Export Report"
  * Benefit-focused: "Save Changes", "Apply Discount", "Print Label"
  * Context-appropriate: "View Details", "Edit", "Duplicate"
  * Consistent button hierarchy and styling

## 17. Final Notes

This admin dashboard design provides IK Electronics with a comprehensive business management center that:
- Puts the business owner (IK) in control of their store
- Provides real-time insights into store performance
- Enables efficient product, order, and customer management
- Scales with the business as it grows
- Maintains security and compliance standards
- Delivers an excellent user experience on all devices

The design balances functionality with usability, ensuring that IK can run their store effectively without being overwhelmed by complexity. Modular implementation allows for phased rollout, starting with core functionality and adding advanced features as needed.

**Next Steps**: Review this design with stakeholders, gather feedback, refine based on business priorities, then begin implementation following the outlined roadmap.