import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-eyebrow text-primary">404</p>
      <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">
        That page wandered off.
      </h1>
      <p className="mt-4 text-muted-foreground">
        We couldn&apos;t find the page you were looking for. Try the catalogue instead.
      </p>
      <Button asChild size="lg" className="mt-6">
        <Link href="/products">Browse products</Link>
      </Button>
      <Link href="/" className="mt-3 text-sm font-semibold text-primary hover:underline">
        Back to home
      </Link>
    </main>
  );
}