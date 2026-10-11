import { Plus } from "lucide-react";
import { Badge, ButtonLink, Card, EmptyState, Notice } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";
import { deleteCategory } from "@/lib/categories-actions";
import { getAdminCategories } from "@/lib/supabase";

export const metadata = {
  title: "Categories",
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
}) {
  const [categories, params] = await Promise.all([getAdminCategories(), searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"} for grouping products.
          </p>
        </div>
        <ButtonLink href="/categories/new">
          <Plus className="size-4" aria-hidden="true" />
          New category
        </ButtonLink>
      </div>

      {params.created ? <Notice tone="success">Category created.</Notice> : null}
      {params.updated ? <Notice tone="success">Category updated.</Notice> : null}
      {params.deleted === "1" ? <Notice tone="success">Category deleted.</Notice> : null}
      {params.deleted === "0" ? (
        <Notice>
          Could not delete that category. Make sure no products are using it first.
        </Notice>
      ) : null}

      {categories.length === 0 ? (
        <EmptyState>
          <p className="font-semibold text-foreground">No categories yet.</p>
          <p className="mt-1">Create categories before adding products.</p>
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="flex flex-col">
              <div className="flex flex-1 flex-col gap-1 p-5">
                <div className="flex items-start justify-between gap-3">
                  <a
                    href={`/categories/${category.id}/edit`}
                    className="font-semibold hover:text-primary"
                  >
                    {category.name}
                  </a>
                  <Badge className="border-transparent bg-muted text-muted-foreground">
                    /{category.slug}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {category.description || "No description."}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 border-t p-3">
                <ButtonLink href={`/categories/${category.id}/edit`} variant="ghost">
                  Edit
                </ButtonLink>
                <DeleteButton
                  id={category.id}
                  formAction={deleteCategory}
                  label="Delete"
                  confirmText={`Delete the "${category.name}" category? Products using it will be affected.`}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}