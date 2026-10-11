import { createClient } from "@supabase/supabase-js";
import { categories, products } from "./catalog-data.mjs";

process.loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error: catErr } = await supabase
  .from("categories")
  .upsert(
    categories.map((c) => ({ name: c.name, slug: c.slug, description: c.description })),
    { onConflict: "slug" },
  );
if (catErr) {
  console.error("Category upsert failed:", catErr.message);
  process.exit(1);
}
console.log(`Upserted ${categories.length} categories.`);

const { data: catRows, error: catReadErr } = await supabase.from("categories").select("id, slug");
if (catReadErr) {
  console.error("Reading categories failed:", catReadErr.message);
  process.exit(1);
}
const categoryIdBySlug = new Map(catRows.map((c) => [c.slug, c.id]));

const rows = products.map((p) => {
  const price = p.price ?? 0;
  const compareAt = p.compareAtPrice && p.compareAtPrice > price ? p.compareAtPrice : null;
  return {
    category_id: categoryIdBySlug.get(p.categorySlug) ?? null,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price,
    compare_at_price: compareAt,
    stock_quantity: p.stock ?? 0,
    low_stock_threshold: 5,
    track_quantity: true,
    images: [`/product-images/${p.slug}.jpg`],
    specs: p.specs ?? {},
    tags: p.tags ?? [],
    is_featured: Boolean(p.featured),
    is_published: true,
  };
});

const { error: prodErr } = await supabase.from("products").upsert(rows, { onConflict: "slug" });
if (prodErr) {
  console.error("Product upsert failed:", prodErr.message);
  process.exit(1);
}
console.log(`Upserted ${rows.length} products.`);

const { count } = await supabase
  .from("products")
  .select("*", { count: "exact", head: true })
  .eq("is_published", true);
console.log(`Published products now in DB: ${count}.`);