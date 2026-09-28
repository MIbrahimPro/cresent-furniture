import "server-only";

/**
 * Next.js cannot serialize MongoDB ObjectId / Date instances across the
 * Server → Client Component boundary (it throws "Only plain objects can be
 * passed to Client Components"). Every Mongo document must go through
 * `toPlain` before it becomes a client-component prop.
 *
 * - ObjectId   → its 24-char hex string
 * - Date       → ISO string
 * - Arrays / plain objects → mapped recursively
 * - Everything else (string, number, bool, null) → untouched
 */
export function toPlain<T>(value: T): unknown {
  if (value === null || value === undefined) return value;

  const anyVal = value as { _bsontype?: string; toHexString?: () => string };

  if (anyVal._bsontype === "ObjectId" && typeof anyVal.toHexString === "function") {
    return anyVal.toHexString();
  }

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) return value.map(toPlain);

  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = toPlain(v);
    }
    return out;
  }

  return value;
}

/**
 * Convert a list of documents, preserving array shape (types stay as declared,
 * since _id is declared `ObjectId` in lib/types but is a string by the time it
 * reaches the client — client code only ever does String(_id) on it).
 */
export function toPlainList<T>(list: T[]): T[] {
  return list.map((item) => toPlain(item) as T);
}

/** Single-document convenience wrapper. */
export function toPlainDoc<T>(doc: T): T {
  return toPlain(doc) as T;
}
