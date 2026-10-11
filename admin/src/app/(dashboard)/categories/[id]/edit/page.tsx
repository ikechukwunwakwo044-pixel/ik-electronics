import { notFound } from "next/navigation";
import { ButtonLink, Card, CardBody } from "@/components/ui";
import { CategoryForm } from "@/components/category-form";
import { updateCategory } from "@/lib/categories-actions";
import { getAdminCategory } from "@/lib/supabase";

export const metadata = {
  title: "Edit Category",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getAdminCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Edit category</h1>
          <p className="mt-1 text-sm text-muted-foreground">{category.name}</p>
        </div>
        <ButtonLink href="/categories" variant="ghost">
          Back
        </ButtonLink>
      </div>

      <Card>
        <CardBody className="p-6">
          <CategoryForm category={category} action={updateCategory.bind(null, category.id)} />
        </CardBody>
      </Card>
    </div>
  );
}