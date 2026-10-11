"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminClient, slugify } from "@/lib/supabase";

export type ProductFormState = { error?: string; values?: Record<string, string> };

type ProductInput = {
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  price: string;
  compare_at_price: string | null;
  sku: string | null;
  track_quantity: boolean;
  stock_quantity: string;
  imagesText: string;
  specsJson: string;
  tagsText: string;
  is_featured: boolean;
  is_published: boolean;
};

function parseInput(
  formData: FormData,
): { error?: string; values?: Record<string, string>; data?: ProductInput } {
  const track_quantity = formData.get("track_quantity") === "on";
  const is_featured = formData.get("is_featured") === "on";
  const is_published = formData.get("is_published") === "on";

  const values: Record<string, string> = {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category_id: String(formData.get("category_id") ?? ""),
    price: String(formData.get("price") ?? ""),
    compare_at_price: String(formData.get("compare_at_price") ?? "").trim(),
    sku: String(formData.get("sku") ?? "").trim(),
    stock_quantity: String(formData.get("stock_quantity") ?? "0"),
    imagesText: String(formData.get("images") ?? "").trim(),
    specsJson: String(formData.get("specs") ?? "").trim(),
    tagsText: String(formData.get("tags") ?? "").trim(),
  };

  if (!values.name) {
    return { error: "Product name is required.", values };
  }

  const price = Number(values.price);
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Please enter a valid price (0 or more).", values };
  }

  let compareAt: number | null = null;
  if (values.compare_at_price) {
    compareAt = Number(values.compare_at_price);
    if (!Number.isFinite(compareAt) || compareAt < 0) {
      return { error: "Comparison price must be a valid number.", values };
    }
  }

  let specs: Record<string, string> = {};
  if (values.specsJson) {
    try {
      const parsed = JSON.parse(values.specsJson);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("not an object");
      }
      specs = parsed as Record<string, string>;
    } catch {
      return {
        error: "Specifications must be valid JSON, e.g. {\"Brand\": \"Samsung\"}.",
        values,
      };
    }
  }

  let slug = values.name;
  const rawSlug = String(formData.get("slug") ?? "").trim();
  if (rawSlug) {
    slug = slugify(rawSlug);
  } else {
    slug = slugify(slug);
  }
  if (!slug) {
    return { error: "Could not build a URL slug from the product name.", values };
  }

  const images = values.imagesText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const tags = values.tagsText
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    data: {
      name: values.name as string,
      slug: slug as string,
      description: (values.description || null) as string | null,
      category_id: (values.category_id || null) as string | null,
      price: values.price as string,
      compare_at_price: (compareAt != null ? String(compareAt) : null) as string | null,
      sku: (values.sku || null) as string | null,
      track_quantity,
      stock_quantity: (values.stock_quantity || "0") as string,
      imagesText: images.join("\n") as string,
      specsJson: values.specsJson as string,
      tagsText: tags.join(", ") as string,
      is_featured,
      is_published,
    },
    values: {
      ...values,
      slug: slug as string,
      imageLines: images.join("\n") as string,
      tags: tags.join(", ") as string,
    },
  };
}

function toDbRow(data: ProductInput) {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description,
    category_id: data.category_id,
    price: data.price,
    compare_at_price: data.compare_at_price,
    sku: data.sku,
    track_quantity: data.track_quantity,
    stock_quantity: toInt(data.stock_quantity),
    images: data.imagesText.split(/\r?\n/).filter(Boolean),
    specs: data.specsJson && data.specsJson.trim() ? parseJsonSafe(data.specsJson) : {},
    tags: data.tagsText.split(",").map((t) => t.trim()).filter(Boolean),
    is_featured: data.is_featured,
    is_published: data.is_published,
  };
}

function toInt(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

function parseJsonSafe(value: string) {
  try {
    return JSON.parse(value) as Record<string, string>;
  } catch {
    return {};
  }
}

export async function createProduct(prevState: ProductFormState, formData: FormData) {
  const parsed = parseInput(formData);
  if (parsed.error || !parsed.data) {
    return { error: parsed.error, values: parsed.values };
  }

  const { error } = await adminClient().from("products").insert(toDbRow(parsed.data));
  if (error) {
    if (error.code === "23505") {
      return {
        error: "A product with this slug already exists. Change the slug or name.",
        values: parsed.values,
      };
    }
    return { error: error.message, values: parsed.values };
  }

  revalidatePath("/products");
  redirect("/products?created=1");
}

export async function updateProduct(id: string, prevState: ProductFormState, formData: FormData) {
  const parsed = parseInput(formData);
  if (parsed.error || !parsed.data) {
    return { error: parsed.error, values: parsed.values };
  }

  const { error } = await adminClient().from("products").update(toDbRow(parsed.data)).eq("id", id);
  if (error) {
    if (error.code === "23505") {
      return {
        error: "A product with this slug already exists. Change the slug or name.",
        values: parsed.values,
      };
    }
    return { error: error.message, values: parsed.values };
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}/edit`);
  redirect("/products?updated=1");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/products?deleted=0");
  }

  const { error } = await adminClient().from("products").delete().eq("id", id);
  if (error) {
    redirect(`/products?deleted=0`);
  }

  revalidatePath("/products");
  redirect("/products?deleted=1");
}