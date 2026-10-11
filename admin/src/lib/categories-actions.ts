"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminClient, slugify } from "@/lib/supabase";

export type CategoryFormState = { error?: string; values?: Record<string, string> };

function parseInput(formData: FormData): { error?: string; values?: Record<string, string>; data?: Record<string, string | null> } {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  if (!slug) {
    slug = slugify(name);
  } else {
    slug = slugify(slug);
  }

  if (!name) {
    return { error: "Category name is required.", values: { name } };
  }
  if (!slug) {
    return { error: "Could not build a URL slug from the category name.", values: { name } };
  }

  return {
    data: {
      name,
      slug,
      description: description || null,
      image_url: image_url || null,
    },
    values: { name, slug, description, image_url },
  };
}

export async function createCategory(prevState: CategoryFormState, formData: FormData) {
  const parsed = parseInput(formData);
  if (parsed.error || !parsed.data) {
    return { error: parsed.error, values: parsed.values };
  }

  const { error } = await adminClient().from("categories").insert(parsed.data);
  if (error) {
    if (error.code === "23505") {
      return { error: "A category with this slug already exists.", values: parsed.values };
    }
    return { error: error.message, values: parsed.values };
  }

  revalidatePath("/categories");
  redirect("/categories?created=1");
}

export async function updateCategory(id: string, prevState: CategoryFormState, formData: FormData) {
  const parsed = parseInput(formData);
  if (parsed.error || !parsed.data) {
    return { error: parsed.error, values: parsed.values };
  }

  const { error } = await adminClient().from("categories").update(parsed.data).eq("id", id);
  if (error) {
    if (error.code === "23505") {
      return { error: "A category with this slug already exists.", values: parsed.values };
    }
    return { error: error.message, values: parsed.values };
  }

  revalidatePath("/categories");
  revalidatePath(`/categories/${id}/edit`);
  redirect("/categories?updated=1");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/categories?deleted=0");
  }

  const { error } = await adminClient().from("categories").delete().eq("id", id);
  if (error) {
    redirect("/categories?deleted=0");
  }

  revalidatePath("/categories");
  redirect("/categories?deleted=1");
}