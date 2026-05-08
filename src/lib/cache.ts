import { redis } from "./redis";

export const TTL = {
  LIVE: 60,
  FIXTURES: 30 * 60,
  STANDINGS: 60 * 60,
  SCHEDULE: 24 * 60 * 60,
} as const;

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function setCache<T>(
  key: string,
  data: T,
  ttl: number,
): Promise<void> {
  try {
    await redis.set(key, data, { ex: ttl });
  } catch {
    // falha silenciosa — a app continua sem cache
  }
}

export async function withCache<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>,
): Promise<{ data: T; fromCache: boolean; cachedAt?: Date }> {
  const cached = await getCache<{ data: T; savedAt: string }>(key);

  if (cached) {
    return {
      data: cached.data,
      fromCache: true,
      cachedAt: new Date(cached.savedAt),
    };
  }

  const data = await fn();
  const savedAt = new Date().toISOString();

  await setCache(key, { data, savedAt }, ttl);

  return { data, fromCache: false };
}
