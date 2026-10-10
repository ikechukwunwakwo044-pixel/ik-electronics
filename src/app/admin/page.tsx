import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/account");
  }

  const [{ count: products }, { count: orders }, { count: lowStock }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).lte("stock_quantity", 5),
  ]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-display text-5xl font-semibold">Admin dashboard</h1>
        <p className="mt-3 text-muted-foreground">
          Manage product visibility, stock, orders, and sales operations.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["Products", products ?? 0],
          ["Orders", orders ?? 0],
          ["Low stock", lowStock ?? 0],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
