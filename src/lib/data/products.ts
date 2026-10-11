import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types";

const productSelect = `
  id,
  category_id,
  name,
  slug,
  description,
  price,
  compare_at_price,
  sku,
  track_quantity,
  stock_quantity,
  images,
  specs,
  tags,
  is_featured,
  is_published
`;

export async function getFeaturedProducts() {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Failed to load featured products", error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProducts() {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products", error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProduct(slug: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    return null;
  }

  return data as Product;
}

export async function getCategories() {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, image_url")
    .order("name");

  if (error) {
    console.error("Failed to load categories", error.message);
    return [];
  }

  return (data ?? []) as Category[];
}
