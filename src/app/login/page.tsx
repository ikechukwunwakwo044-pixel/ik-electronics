import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, signUp } from "@/app/login/actions";

export const metadata = {
  title: "Sign in",
};

const messages: Record<string, { tone: "error" | "success"; text: string }> = {
  missing: { tone: "error", text: "Please enter your email and password." },
  invalid: { tone: "error", text: "Incorrect email or password. Please try again." },
  weak: { tone: "error", text: "Password must be at least 6 characters." },
  signup: { tone: "error", text: "We couldn't create that account. It may already exist." },
  confirm: {
    tone: "success",
    text: "Account created. Check your email to confirm your address, then sign in.",
  },
  oauth: { tone: "error", text: "Social sign-in isn't available right now. Please use email and password." },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const message = params.error ? messages[params.error] : undefined;
  const next = params.next && params.next.startsWith("/") ? params.next : "/account";

  return (
    <main className="mx-auto flex min-h-[72vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="items-center gap-3 text-center">
          <Image
            src="/ik-electronics-logo.jpeg"
            alt="IK Electronics and Gadgets"
            width={56}
            height={56}
            className="size-14 rounded-lg border border-border object-cover"
          />
          <CardTitle className="font-display text-4xl font-extrabold tracking-tight">Sign in</CardTitle>
          <CardDescription>
            Sign in with your email to track orders and save your details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <input type="hidden" name="next" value={next} />

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-11 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Password</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                placeholder="Your password"
                className="h-11 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>

            {message ? (
              <p
                role="status"
                className={
                  message.tone === "error"
                    ? "rounded-md border border-[#c0392b]/30 bg-[#c0392b]/10 px-3 py-2 text-sm text-[#9a3412]"
                    : "rounded-md border border-green-600/30 bg-green-600/10 px-3 py-2 text-sm text-green-800"
                }
              >
                {message.text}
              </p>
            ) : null}

            <div className="flex flex-col gap-2">
              <Button type="submit" formAction={signIn} size="lg">
                Sign in
              </Button>
              <Button type="submit" formAction={signUp} size="lg" variant="outline">
                Create account
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Prefer to order directly?{" "}
            <Link href="/products" className="font-semibold text-primary hover:underline">
              Browse products
            </Link>{" "}
            or{" "}
            <Link href="/#contact" className="font-semibold text-primary hover:underline">
              message us
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
}