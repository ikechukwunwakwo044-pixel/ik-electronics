import Link from "next/link";
import { Lock, PackageCheck } from "lucide-react";
import { Notice } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import { signIn } from "@/lib/auth-actions";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const invalid = params.error === "invalid";

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <PackageCheck className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">IK Electronics Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Restricted area. Enter the admin password to continue.
            </p>
          </div>
        </div>

        <form
          action={signIn}
          className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="Admin password"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          {invalid ? <Notice>Incorrect password. Please try again.</Notice> : null}

          <SubmitButton className="mt-1">
            <Lock className="size-4" aria-hidden="true" />
            Sign in
          </SubmitButton>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          This tool is private.{" "}
          <Link
            href="https://ik-electronics-mu.vercel.app"
            className="font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Storefront
          </Link>
        </div>
      </div>
    </main>
  );
}