import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { getCollection } from "./mongo";
import { makeToken, SESSION_COOKIE, SESSION_MAX_AGE } from "./session";
import type { CrmUser } from "./types";

export { SESSION_COOKIE } from "./session";

function secret(): string {
  const s = process.env.CRM_SESSION_SECRET || process.env.MONGODB_URI || "crescent-dev-secret";
  return crypto.createHash("sha256").update(s).digest("hex");
}

export async function setSessionCookie(userId: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await makeToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const users = await getCollection<CrmUser>("crm_users");
  const user = await users.findOne({ _id: new (await import("mongodb")).ObjectId(userId) });
  if (!user) return null;
  return { id: userId, name: user.name, email: user.email, role: user.role };
}

export async function login(email: string, password: string): Promise<boolean> {
  const users = await getCollection<CrmUser>("crm_users");
  const user = await users.findOne({ email: email.toLowerCase().trim() });
  if (!user) return false;
  const hash = crypto.scryptSync(password, user.email, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(user.passwordHash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  await setSessionCookie(String(user._id));
  return true;
}

export function hashPassword(password: string, email: string): string {
  return crypto.scryptSync(password, email.toLowerCase().trim(), 64).toString("hex");
}
