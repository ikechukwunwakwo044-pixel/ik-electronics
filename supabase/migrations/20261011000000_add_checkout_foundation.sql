-- ==============================================================================
-- IK ELECTRONICS - NGN CHECKOUT FOUNDATION
-- All payment amounts in this migration are integer kobo, never floating point.
-- ==============================================================================

alter table public.orders
  add column if not exists currency text not null default 'NGN' check (currency = 'NGN'),
  add column if not exists subtotal_kobo bigint check (subtotal_kobo >= 0),
  add column if not exists discount_kobo bigint not null default 0 check (discount_kobo >= 0),
  add column if not exists shipping_fee_kobo bigint not null default 0 check (shipping_fee_kobo >= 0),
  add column if not exists tax_kobo bigint not null default 0 check (tax_kobo >= 0),
  add column if not exists total_kobo bigint check (total_kobo >= 0),
  add column if not exists order_channel text not null default 'online' check (order_channel in ('online', 'whatsapp_enquiry', 'admin')),
  add column if not exists fulfilment_status text not null default 'unfulfilled' check (fulfilment_status in ('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  add column if not exists idempotency_key uuid unique;

alter table public.order_items
  add column if not exists sku_snapshot text,
  add column if not exists variant_snapshot jsonb not null default '{}'::jsonb,
  add column if not exists unit_price_kobo bigint check (unit_price_kobo >= 0),
  add column if not exists discount_kobo bigint not null default 0 check (discount_kobo >= 0),
  add column if not exists line_total_kobo bigint check (line_total_kobo >= 0);

create table if not exists public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null check (provider in ('paystack', 'flutterwave')),
  merchant_reference text not null unique,
  provider_transaction_id text unique,
  amount_kobo bigint not null check (amount_kobo > 0),
  currency text not null default 'NGN' check (currency = 'NGN'),
  status text not null default 'pending' check (status in ('pending', 'processing', 'successful', 'failed', 'abandoned', 'refunded', 'partially_refunded')),
  initialized_at timestamptz,
  verified_at timestamptz,
  safe_provider_metadata jsonb not null default '{}'::jsonb,
  failure_code text,
  failure_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, provider, merchant_reference)
);

create index if not exists idx_payment_attempts_order_id on public.payment_attempts(order_id);
create index if not exists idx_payment_attempts_provider_transaction_id on public.payment_attempts(provider_transaction_id);
create index if not exists idx_payment_attempts_status on public.payment_attempts(status);

create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('paystack', 'flutterwave')),
  provider_event_id text not null,
  event_type text not null,
  payload_digest text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_error text,
  unique (provider, provider_event_id)
);

create table if not exists public.store_settings (
  id boolean primary key default true check (id),
  whatsapp_number text,
  whatsapp_enabled boolean not null default false,
  whatsapp_message_template text not null default 'Hello IK Electronics and Gadgets, I would like to enquire about: {items}',
  support_hours text,
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id)
values (true)
on conflict (id) do nothing;

drop trigger if exists trigger_payment_attempts_updated_at on public.payment_attempts;
create trigger trigger_payment_attempts_updated_at
  before update on public.payment_attempts
  for each row execute function public.handle_updated_at();

drop trigger if exists trigger_store_settings_updated_at on public.store_settings;
create trigger trigger_store_settings_updated_at
  before update on public.store_settings
  for each row execute function public.handle_updated_at();

alter table public.payment_attempts enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.store_settings enable row level security;

create policy "Customers can view payment attempts for their own orders"
  on public.payment_attempts for select to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = payment_attempts.order_id
        and (orders.customer_id = (select auth.uid()) or public.is_admin())
    )
  );

create policy "Admins can manage payment attempts"
  on public.payment_attempts for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can view payment webhook events"
  on public.payment_webhook_events for select to authenticated
  using (public.is_admin());

create policy "Admins can view store settings"
  on public.store_settings for select to authenticated
  using (public.is_admin());

create policy "Admins can update store settings"
  on public.store_settings for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
