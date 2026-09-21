import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { getCollection } from "./mongo";
import type { CrmUser } from "./types";

const COOKIE = "crm_session";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function secret(): string {
  const s = process.env.CRM_SESSION_SECRET || process.env.MONGODB_URI || "crescent-dev-secret";
  return crypto.createHash("sha256").update(s).digest("hex");
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function makeToken(userId: string): string {
  const payload = `${userId}.${Date.now()}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifyToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString();
  } catch {
    return null;
  }
  if (sign(payload) !== sig) return null;
  const [userId, ts] = payload.split(".");
  if (!userId || !ts) return null;
  if (Date.now() - Number(ts) > MAX_AGE * 1000) return null;
  return userId;
}

export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const userId = verifyToken(token);
  if (!userId) return null;
  const users = await getCollection<CrmUser>("crm_users");
  const user = await users.findOne({ _id: new (await import("mongodb")).ObjectId(userId) });
  if (!user) return null;
  return { id: userId, name: user.name, email: user.email, role: user.role };
}

export async function setSessionCookie(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE, makeToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
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
