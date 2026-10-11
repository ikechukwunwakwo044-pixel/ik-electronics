"use client";

import { useActionState } from "react";
import { Checkbox, Field, Input, Notice, Select, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import type { AdminCategory, AdminProduct } from "@/lib/supabase";
import type { ProductFormState } from "@/lib/products-actions";

type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  category_id: string;
  price: string;
  compare_at_price: string;
  sku: string;
  stock_quantity: string;
  images: string;
  specs: string;
  tags: string;
  track_quantity: boolean;
  is_featured: boolean;
  is_published: boolean;
};

function initialValues(product?: AdminProduct): ProductFormValues {
  if (!product) {
    return {
      name: "",
      slug: "",
      description: "",
      category_id: "",
      price: "",
      compare_at_price: "",
      sku: "",
      stock_quantity: "0",
      images: "",
      specs: "",
      tags: "",
      track_quantity: true,
      is_featured: false,
      is_published: false,
    };
  }

  return {
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    category_id: product.category_id ?? "",
    price: String(product.price),
    compare_at_price: product.compare_at_price != null ? String(product.compare_at_price) : "",
    sku: product.sku ?? "",
    stock_quantity: String(product.stock_quantity),
    images: (product.images ?? []).join("\n"),
    specs: Object.keys(product.specs ?? {}).length ? JSON.stringify(product.specs, null, 2) : "",
    tags: (product.tags ?? []).join(", "),
    track_quantity: product.track_quantity,
    is_featured: product.is_featured,
    is_published: product.is_published,
  };
}

function mergeValues(base: ProductFormValues, state: ProductFormState): ProductFormValues {
  if (!state.values) return base;
  return {
    name: String(state.values.name ?? base.name),
    slug: String(state.values.slug ?? base.slug),
    description: String(state.values.description ?? base.description),
    category_id: String(state.values.category_id ?? base.category_id),
    price: String(state.values.price ?? base.price),
    compare_at_price: String(state.values.compare_at_price ?? base.compare_at_price),
    sku: String(state.values.sku ?? base.sku),
    stock_quantity: String(state.values.stock_quantity ?? base.stock_quantity),
    images: String(state.values.imagesText ?? base.images),
    specs: String(state.values.specsJson ?? base.specs),
    tags: String(state.values.tagsText ?? base.tags),
    track_quantity: base.track_quantity,
    is_featured: base.is_featured,
    is_published: base.is_published,
  };
}

export function ProductForm({
  product,
  categories,
  action,
}: {
  product?: AdminProduct;
  categories: AdminCategory[];
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
}) {
  const [state, formAction] = useActionState(action, {});
  const values = mergeValues(initialValues(product), state);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error ? <Notice>{state.error}</Notice> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Product name">
          <Input name="name" required defaultValue={values.name} placeholder={'55" Samsung Crystal TV'} />
        </Field>
        <Field label="URL slug" hint="Leave blank to generate from the name.">
          <Input name="slug" defaultValue={values.slug} placeholder="samsung-crystal-tv-55" />
        </Field>
      </div>

      <Field label="Description">
        <Textarea
          name="description"
          defaultValue={values.description}
          placeholder="What is the product, who is it for, and what makes it worth buying?"
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Category">
          <Select name="category_id" defaultValue={values.category_id}>
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="SKU (optional)">
          <Input name="sku" defaultValue={values.sku} placeholder="IK-TV55" />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Price (NGN)">
          <Input name="price" type="number" min="0" step="0.01" required defaultValue={values.price} placeholder="450000" />
        </Field>
        <Field label="Compare-at price (NGN)" hint="Optional; shown struck-through.">
          <Input name="compare_at_price" type="number" min="0" step="0.01" defaultValue={values.compare_at_price} placeholder="500000" />
        </Field>
        <Field label="Stock quantity">
          <Input name="stock_quantity" type="number" min="0" step="1" defaultValue={values.stock_quantity} />
        </Field>
      </div>

      <Field label="Image URLs" hint="One https:// URL per line. The first image is the main photo.">
        <Textarea
          name="images"
          defaultValue={values.images}
          placeholder={"https://images.unsplash.com/photo-…\nhttps://images.unsplash.com/photo-…"}
        />
      </Field>

      <Field
          label="Specifications (JSON)"
          hint={"Optional. Valid JSON object, e.g. {\"Brand\": \"Samsung\", \"Screen size\": \"55 inch\"}."}
        >
        <Textarea name="specs" defaultValue={values.specs} placeholder={"{ \"Brand\": \"Samsung\" }"} />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Tags" hint="Comma separated, e.g. tv, qled, smart.">
          <Input name="tags" defaultValue={values.tags} placeholder="tv, qled, smart" />
        </Field>
        <div className="flex flex-col justify-end gap-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox name="track_quantity" defaultChecked={values.track_quantity} />
            Track stock quantity
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox name="is_featured" defaultChecked={values.is_featured} />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox name="is_published" defaultChecked={values.is_published} />
            Published (visible on the storefront)
          </label>
        </div>
      </div>

      <div className="flex justify-end border-t pt-5">
        <SubmitButton>{product ? "Save changes" : "Create product"}</SubmitButton>
      </div>
    </form>
  );
}