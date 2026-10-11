import { notFound } from "next/navigation";
import { ButtonLink, Card, CardBody } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";
import { ProductForm } from "@/components/product-form";
import { deleteProduct, updateProduct } from "@/lib/products-actions";
import { getAdminCategories, getAdminProduct } from "@/lib/supabase";

export const metadata = {
  title: "Edit Product",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProduct(id), getAdminCategories()]);

  if (!product) {
    notFound();
  }

  const action = updateProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Edit product</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
        </div>
        <ButtonLink href="/products" variant="ghost">
          Back
        </ButtonLink>
      </div>

      <Card>
        <CardBody className="p-6">
          <ProductForm product={product} categories={categories} action={action} />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex flex-col gap-2 p-6">
          <p className="font-semibold text-red-700">Danger zone</p>
          <p className="text-sm text-muted-foreground">
            Permanently remove this product from the catalogue.
          </p>
          <div className="flex items-center gap-3">
            <DeleteButton
              id={product.id}
              formAction={deleteProduct}
              label="Delete product"
              confirmText={`Delete "${product.name}" forever? This cannot be undone.`}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}