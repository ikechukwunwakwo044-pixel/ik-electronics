export type SessionCookie = {
  name: "ik_admin_session";
  value: string;
};

const SESSION_NAME = "ik_admin_session" as const;
const SESSION_MARKER = "ik_admin_authorized_v1" as const;

export function sessionCookieMeta(): SessionCookie {
  return { name: SESSION_NAME, value: SESSION_MARKER };
}

export function isSessionValue(value: string | undefined): boolean {
  return value === SESSION_MARKER;
}