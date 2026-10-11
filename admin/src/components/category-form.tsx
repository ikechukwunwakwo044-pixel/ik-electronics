"use client";

import { useActionState } from "react";
import { Field, Input, Notice, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import type { AdminCategory } from "@/lib/supabase";
import type { CategoryFormState } from "@/lib/categories-actions";

function initialValues(category?: AdminCategory) {
  if (!category) {
    return { name: "", slug: "", description: "", image_url: "" };
  }
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    image_url: category.image_url ?? "",
  };
}

export function CategoryForm({
  category,
  action,
}: {
  category?: AdminCategory;
  action: (prevState: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
}) {
  const [state, formAction] = useActionState(action, {});
  const values =
    state.values?.name !== undefined
      ? {
          name: state.values.name,
          slug: state.values.slug ?? "",
          description: state.values.description ?? "",
          image_url: state.values.image_url ?? "",
        }
      : initialValues(category);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error ? <Notice>{state.error}</Notice> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Category name">
          <Input name="name" required defaultValue={values.name} placeholder="Televisions" />
        </Field>
        <Field label="URL slug" hint="Leave blank to generate from the name.">
          <Input name="slug" defaultValue={values.slug} placeholder="televisions" />
        </Field>
      </div>

      <Field label="Description">
        <Textarea
          name="description"
          defaultValue={values.description}
          placeholder="Short description shown on the storefront category cards."
        />
      </Field>

      <Field label="Image URL" hint="Optional. Used for the category card on the homepage.">
        <Input name="image_url" defaultValue={values.image_url} placeholder="https://…" />
      </Field>

      <div className="flex justify-end border-t pt-5">
        <SubmitButton>{category ? "Save changes" : "Create category"}</SubmitButton>
      </div>
    </form>
  );
}