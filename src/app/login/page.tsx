import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

async function signInWithGoogle() {
  "use server";

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth");
  }

  redirect(data.url);
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[72vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-display text-4xl">Sign in</CardTitle>
          <CardDescription>
            Use your Google account to manage orders and access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signInWithGoogle}>
            <Button className="w-full" size="lg" type="submit">
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
