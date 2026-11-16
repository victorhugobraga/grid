export interface Favorite {
  id: string;
  name: string;
  url: string;
}

/** Normaliza a URL digitada. Retorna null se inválida ou não-http(s). */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const hasHttp = /^https?:\/\//i.test(trimmed);
  const hasOtherScheme = !hasHttp && /^[a-z][a-z0-9+.-]*:(?!\d)/i.test(trimmed);
  if (hasOtherScheme) return null;
  const candidate = hasHttp ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function faviconUrl(url: string): string {
  const host = new URL(url).hostname;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
}
