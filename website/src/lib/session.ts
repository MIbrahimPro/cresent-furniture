// Session token signing/verification using Web Crypto only, so this file
// works in both the Node runtime (route handlers) and the Edge runtime
// (middleware). Password hashing lives in auth.ts (node:crypto).

export const SESSION_COOKIE = "crm_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function secretString(): string {
  return process.env.CRM_SESSION_SECRET || process.env.MONGODB_URI || "crescent-dev-secret";
}

function toB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
  const bin = atob(b64 + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

const encoder = new TextEncoder();

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secretString()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function sign(payload: string): Promise<string> {
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toB64url(new Uint8Array(sig));
}

export async function makeToken(userId: string): Promise<string> {
  const payload = `${userId}.${Date.now()}`;
  return `${toB64url(encoder.encode(payload))}.${await sign(payload)}`;
}

export async function verifyToken(token: string): Promise<string | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  let payload = "";
  try {
    payload = new TextDecoder().decode(fromB64url(payloadB64));
  } catch {
    return null;
  }
  if ((await sign(payload)) !== sig) return null;
  const [userId, ts] = payload.split(".");
  if (!userId || !ts) return null;
  if (Date.now() - Number(ts) > SESSION_MAX_AGE * 1000) return null;
  return userId;
}
