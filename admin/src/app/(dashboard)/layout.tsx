import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Boxes, LayoutDashboard, LogOut, PackageCheck, Tags } from "lucide-react";
import { isSessionValue, sessionCookieMeta } from "@/lib/auth";
import { signOut } from "@/lib/auth-actions";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/categories", label: "Categories", icon: Tags },
];

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  if (!isSessionValue(cookieStore.get(sessionCookieMeta().name)?.value)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r bg-secondary text-secondary-foreground">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white/10">
            <PackageCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-extrabold tracking-tight">IK Electronics</p>
            <p className="text-xs text-white/50">Store admin</p>
          </div>
        </div>

        <nav className="mt-2 flex flex-col gap-1 px-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        <form action={signOut} className="mt-auto border-t border-white/10 p-3">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}