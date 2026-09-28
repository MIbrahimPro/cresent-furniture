/**
 * Base-path-aware API helper. When the site is deployed under a subpath
 * (projects.nyronic.com/cresent-furniture), Next bakes `basePath` into its
 * own routing but NOT into hand-written fetch("/api/...") calls — those
 * must be prefixed at runtime. In local dev this is "" and changes nothing.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function api(path: string): string {
  return `${BASE_PATH}${path}`;
}
