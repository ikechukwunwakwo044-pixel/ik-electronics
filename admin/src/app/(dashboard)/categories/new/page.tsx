import { ButtonLink, Card, CardBody } from "@/components/ui";
import { CategoryForm } from "@/components/category-form";
import { createCategory } from "@/lib/categories-actions";

export const metadata = {
  title: "New Category",
};

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">New category</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Group products so customers can filter the catalogue.
          </p>
        </div>
        <ButtonLink href="/categories" variant="ghost">
          Back
        </ButtonLink>
      </div>

      <Card>
        <CardBody className="p-6">
          <CategoryForm action={createCategory} />
        </CardBody>
      </Card>
    </div>
  );
}