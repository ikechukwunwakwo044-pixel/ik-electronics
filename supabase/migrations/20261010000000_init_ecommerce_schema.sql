-- ==============================================================================
-- IK ELECTRONICS - PRODUCTION ECOMMERCE SCHEMA
-- Migration: 20261010000000_init_ecommerce_schema.sql
-- ==============================================================================

-- Enable UUID generation used by default column values.
create extension if not exists pgcrypto;

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    slug text not null unique,
    description text,
    image_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    category_id uuid references public.categories(id) on delete set null,
    name text not null,
    slug text not null unique,
    description text,
    price numeric(12, 2) not null check (price >= 0),
    compare_at_price numeric(12, 2) check (compare_at_price is null or compare_at_price >= price),
    cost_price numeric(12, 2),
    sku text unique,
    barcode text,
    track_quantity boolean not null default true,
    stock_quantity integer not null default 0 check (stock_quantity >= 0),
    low_stock_threshold integer not null default 5,
    images text[] not null default array[]::text[],
    specs jsonb not null default '{}'::jsonb,
    tags text[] not null default array[]::text[],
    is_featured boolean not null default false,
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Performance Indexes on Products
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_published on public.products(is_published);
create index if not exists idx_products_featured on public.products(is_featured);

-- ------------------------------------------------------------------------------
-- 3. PROFILES TABLE (Linked to auth.users)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    email text,
    phone text,
    avatar_url text,
    shipping_address jsonb default '{}'::jsonb,
    billing_address jsonb default '{}'::jsonb,
    is_admin boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 4. ORDERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    order_number text not null unique,
    customer_id uuid references public.profiles(id) on delete set null,
    customer_email text not null,
    customer_phone text,
    shipping_address jsonb not null default '{}'::jsonb,
    billing_address jsonb default '{}'::jsonb,
    subtotal numeric(12, 2) not null check (subtotal >= 0),
    shipping_fee numeric(12, 2) not null default 0.00 check (shipping_fee >= 0),
    tax numeric(12, 2) not null default 0.00 check (tax >= 0),
    discount numeric(12, 2) not null default 0.00 check (discount >= 0),
    total numeric(12, 2) not null check (total >= 0),
    status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
    payment_method text,
    payment_reference text,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Performance Indexes on Orders
create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_number on public.orders(order_number);
create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_orders_status on public.orders(status);

-- ------------------------------------------------------------------------------
-- 5. ORDER ITEMS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    product_name text not null,
    unit_price numeric(12, 2) not null check (unit_price >= 0),
    quantity integer not null check (quantity > 0),
    total_price numeric(12, 2) not null check (total_price >= 0),
    product_image text,
    created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on public.order_items(order_id);

-- ------------------------------------------------------------------------------
-- 6. INVENTORY LOGS (Audit trail for stock tracking)
-- ------------------------------------------------------------------------------
create table if not exists public.inventory_logs (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    change_amount integer not null,
    previous_stock integer not null,
    new_stock integer not null,
    reason text not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_inventory_product on public.inventory_logs(product_id);

-- ------------------------------------------------------------------------------
-- 7. REVIEWS & RATINGS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.reviews (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    customer_id uuid references public.profiles(id) on delete set null,
    customer_name text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    is_verified_purchase boolean not null default false,
    is_approved boolean not null default true,
    created_at timestamptz not null default now()
);

create index if not exists idx_reviews_product on public.reviews(product_id);

-- ==============================================================================
-- AUTOMATIC TIMESTAMPS & PROFILE TRIGGER FUNCTIONS
-- ==============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trigger_categories_updated_at
    before update on public.categories
    for each row execute function public.handle_updated_at();

create trigger trigger_products_updated_at
    before update on public.products
    for each row execute function public.handle_updated_at();

create trigger trigger_profiles_updated_at
    before update on public.profiles
    for each row execute function public.handle_updated_at();

create trigger trigger_orders_updated_at
    before update on public.orders
    for each row execute function public.handle_updated_at();

-- Automatically create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, full_name, avatar_url)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
        coalesce(new.raw_user_meta_data->>'avatar_url', '')
    );
    return new;
end;
$$ language plpgsql security definer set search_path = public, auth;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Centralized admin check for RLS policies.
-- Uses security definer to avoid recursive profile-policy lookups.
create or replace function public.is_admin()
returns boolean as $$
begin
    return coalesce((
        select profiles.is_admin
        from public.profiles
        where profiles.id = (select auth.uid())
    ), false);
end;
$$ language plpgsql security definer stable set search_path = public, auth;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_logs enable row level security;
alter table public.reviews enable row level security;

-- CATEGORIES: Public can view, authenticated admins can modify.
create policy "Categories are viewable by everyone"
    on public.categories for select
    to anon, authenticated
    using (true);

create policy "Categories can be inserted by admins"
    on public.categories for insert
    to authenticated
    with check (public.is_admin());

create policy "Categories can be updated by admins"
    on public.categories for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

create policy "Categories can be deleted by admins"
    on public.categories for delete
    to authenticated
    using (public.is_admin());

-- PRODUCTS: Public can view published products, authenticated admins can manage all.
create policy "Published products are viewable by everyone"
    on public.products for select
    to anon, authenticated
    using (is_published = true or public.is_admin());

create policy "Products can be inserted by admins"
    on public.products for insert
    to authenticated
    with check (public.is_admin());

create policy "Products can be updated by admins"
    on public.products for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

create policy "Products can be deleted by admins"
    on public.products for delete
    to authenticated
    using (public.is_admin());

-- PROFILES: Users can view and update their own profile, admins can view all.
create policy "Users can view own profile or admins view all"
    on public.profiles for select
    to authenticated
    using ((select auth.uid()) = id or public.is_admin());

create policy "Users can update own profile"
    on public.profiles for update
    to authenticated
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);

-- ORDERS: Customers can view and create their own orders, admins can manage all.
create policy "Customers can view own orders"
    on public.orders for select
    to authenticated
    using ((select auth.uid()) = customer_id or public.is_admin());

create policy "Authenticated customers can create own orders"
    on public.orders for insert
    to authenticated
    with check ((select auth.uid()) = customer_id);

create policy "Admins can update orders"
    on public.orders for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- ORDER ITEMS: Viewable and creatable only by the order owner or admin.
create policy "Order items viewable by order owner or admin"
    on public.order_items for select
    to authenticated
    using (
        exists (
            select 1 from public.orders
            where orders.id = order_items.order_id
            and (orders.customer_id = (select auth.uid()) or public.is_admin())
        )
    );

create policy "Authenticated customers can insert own order items"
    on public.order_items for insert
    to authenticated
    with check (
        exists (
            select 1 from public.orders
            where orders.id = order_items.order_id
            and (orders.customer_id = (select auth.uid()) or public.is_admin())
        )
    );

-- INVENTORY LOGS: Admin-only audit trail.
create policy "Inventory logs are viewable by admins"
    on public.inventory_logs for select
    to authenticated
    using (public.is_admin());

create policy "Inventory logs can be inserted by admins"
    on public.inventory_logs for insert
    to authenticated
    with check (public.is_admin());

-- REVIEWS: Approved reviews viewable by everyone, authenticated users can insert
create policy "Approved reviews are viewable by everyone"
    on public.reviews for select
    to anon, authenticated
    using (is_approved = true or public.is_admin());

create policy "Authenticated users can create reviews"
    on public.reviews for insert
    to authenticated
    with check ((select auth.uid()) = customer_id);
