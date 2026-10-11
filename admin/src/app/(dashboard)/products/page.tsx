import { Plus } from "lucide-react";
import { Badge, ButtonLink, Card, CardBody, CardHeader, EmptyState, Notice } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";
import { deleteProduct } from "@/lib/products-actions";
import { getAdminCategories, getAdminProducts } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = {
  title: "Products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
}) {
  const [products, categories, params] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
    searchParams,
  ]);

  const categoryName = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} product{products.length === 1 ? "" : "s"} in the catalogue.
          </p>
        </div>
        <ButtonLink href="/products/new">
          <Plus className="size-4" aria-hidden="true" />
          New product
        </ButtonLink>
      </div>

      {params.created ? <Notice tone="success">Product created.</Notice> : null}
      {params.updated ? <Notice tone="success">Product updated.</Notice> : null}
      {params.deleted === "1" ? <Notice tone="success">Product deleted.</Notice> : null}
      {params.deleted === "0" ? <Notice>Could not delete that product.</Notice> : null}

      {products.length === 0 ? (
        <EmptyState>
          <p className="font-semibold text-foreground">No products yet.</p>
          <p className="mt-1">Create your first product to start building the catalogue.</p>
        </EmptyState>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold text-right">Price</th>
                  <th className="px-4 py-3 font-semibold text-center">Stock</th>
                  <th className="px-4 py-3 font-semibold text-center">Status</th>
                  <th className="px-4 py-3 font-semibold">Added</th>
                  <th className="px-4 py-3" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <a href={`/products/${product.id}/edit`} className="font-semibold hover:text-primary">
                        {product.name}
                      </a>
                      <p className="text-xs text-muted-foreground">{product.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {product.category_id ? categoryName.get(product.category_id) ?? "—" : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className={
                          product.stock_quantity <= 0
                            ? "border-transparent bg-red-50 text-red-700"
                            : product.stock_quantity <= 5
                              ? "border-transparent bg-amber-100 text-amber-800"
                              : "border-transparent bg-emerald-100 text-emerald-800"
                        }
                      >
                        {product.stock_quantity}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {product.is_published ? (
                        <Badge className="border-transparent bg-emerald-100 text-emerald-800">
                          Published
                        </Badge>
                      ) : (
                        <Badge className="border-transparent bg-muted text-muted-foreground">
                          Hidden
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(product.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <DeleteButton
                        formAction={deleteProduct}
                        id={product.id}
                        label="Delete"
                        confirmText={`Delete "${product.name}"? This cannot be undone.`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}