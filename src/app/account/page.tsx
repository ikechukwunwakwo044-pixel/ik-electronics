import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";

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
          <CardTitle className="font-display text-4xl font-extrabold tracking-tight">
            Your account
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="rounded-lg border bg-muted px-4 py-3">
            <p className="font-semibold">{user.email}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {user.user_metadata?.name ?? "Signed in"}
            </p>
          </div>
          <p className="text-muted-foreground">
            Order history and saved addresses will appear here as checkout is completed.
          </p>
          <form action={signOut} className="pt-2">
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
