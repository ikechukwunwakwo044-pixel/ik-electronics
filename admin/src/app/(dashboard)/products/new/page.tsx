import { ButtonLink, Card, CardBody } from "@/components/ui";
import { ProductForm } from "@/components/product-form";
import { createProduct } from "@/lib/products-actions";
import { getAdminCategories } from "@/lib/supabase";

export const metadata = {
  title: "New Product",
};

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">New product</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a product to the storefront catalogue.
          </p>
        </div>
        <ButtonLink href="/products" variant="ghost">
          Back
        </ButtonLink>
      </div>

      <Card>
        <CardBody className="p-6">
          <ProductForm categories={categories} action={createProduct} />
        </CardBody>
      </Card>
    </div>
  );
}