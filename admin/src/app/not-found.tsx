import Link from "next/link";
import { ButtonLink } from "@/components/ui";

export default function AdminNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-eyebrow text-primary text-xs font-bold uppercase tracking-[0.14em]">
        404
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight">Not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The record you&apos;re looking for doesn&apos;t exist or was deleted.
      </p>
      <ButtonLink href="/dashboard" variant="ghost">
        Back to dashboard
      </ButtonLink>
      <Link href="/products" className="text-sm font-semibold text-primary hover:underline">
        Products
      </Link>
    </main>
  );
}