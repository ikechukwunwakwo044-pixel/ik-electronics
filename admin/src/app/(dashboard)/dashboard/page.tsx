import { Badge, Card, CardBody, CardHeader } from "@/components/ui";
import { adminClient } from "@/lib/supabase";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const [{ count: total }, { count: published }, { count: lowStock }, { count: categories }] =
    await Promise.all([
      adminClient().from("products").select("id", { count: "exact", head: true }),
      adminClient().from("products").select("id", { count: "exact", head: true }).eq("is_published", true),
      adminClient().from("products").select("id", { count: "exact", head: true }).lte("stock_quantity", 5),
      adminClient().from("categories").select("id", { count: "exact", head: true }),
    ]);

  const stats = [
    { label: "Total products", value: total ?? 0 },
    { label: "Published", value: published ?? 0 },
    { label: "Low stock (≤ 5)", value: lowStock ?? 0 },
    { label: "Categories", value: categories ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          An overview of your catalogue on the IK Electronics storefront.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <Card key={label}>
            <CardHeader>
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </CardHeader>
            <CardBody>
              <p className="text-3xl font-extrabold tracking-tight">{value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody className="p-6 text-sm leading-7">
          <p className="font-semibold">Reminder</p>
          <p className="mt-1 text-muted-foreground">
            Products only appear on the storefront when <Badge className="border-transparent bg-emerald-100 text-emerald-800">Published</Badge> is
            enabled. Use the <span className="font-semibold text-foreground">Featured on homepage</span> flag to surface
            products in the storefront&apos;s featured section.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}