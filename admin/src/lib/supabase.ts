import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

export type AdminProduct = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  track_quantity: boolean;
  stock_quantity: number;
  images: string[];
  specs: Record<string, string>;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

let client: SupabaseClient | null = null;

export function adminClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for the admin app.",
    );
  }

  client = createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await adminClient()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminProduct[];
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  const { data, error } = await adminClient().from("products").select("*").eq("id", id).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return (data as AdminProduct | null) ?? null;
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const { data, error } = await adminClient()
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminCategory[];
}

export async function getAdminCategory(id: string): Promise<AdminCategory | null> {
  const { data, error } = await adminClient().from("categories").select("*").eq("id", id).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return (data as AdminCategory | null) ?? null;
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}