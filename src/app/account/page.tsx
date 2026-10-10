import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-4xl">Your account</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-muted-foreground">
            Order history and saved addresses will appear here as checkout is completed.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
