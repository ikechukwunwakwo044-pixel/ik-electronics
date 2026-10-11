export const SESSION_COOKIE_NAME = "ik_admin_session";

export async function expectedSessionValue(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const bytes = new TextEncoder().encode(`ik_admin_session_v1:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function isSessionValid(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const expected = await expectedSessionValue();
  return value === expected;
}