"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookieMeta } from "@/lib/auth";

function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) {
    throw new Error("ADMIN_PASSWORD is not configured (min 8 characters).");
  }

  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function signIn(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!verifyPassword(password)) {
    redirect("/?error=invalid");
  }

  const meta = sessionCookieMeta();
  const cookieStore = await cookies();
  cookieStore.set(meta.name, meta.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/dashboard");
}

export async function signOut() {
  const meta = sessionCookieMeta();
  const cookieStore = await cookies();
  cookieStore.delete(meta.name);
  redirect("/");
}