export function mockFetchSuccess(data: unknown) {
  return jest.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  } as Response);
}

export function mockFetchError(status = 500) {
  return jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ message: "erro externo" }),
  } as unknown as Response);
}

export function createMockRequest(
  url = "http://localhost:3000/api/test",
  options?: RequestInit,
): Request {
  return new Request(url, options);
}

export function mockCacheMiss() {
  jest.mock("@/lib/cache", () => ({
    withCache: jest.fn((_key: string, _ttl: number, fn: () => unknown) => fn()),
    getCache: jest.fn().mockResolvedValue(null),
    setCache: jest.fn().mockResolvedValue(undefined),
    TTL: {
      LIVE: 60,
      FIXTURES: 1800,
      STANDINGS: 3600,
      SCHEDULE: 86400,
    },
  }));
}

export function mockCacheHit<T>(data: T) {
  jest.mock("@/lib/cache", () => ({
    withCache: jest.fn().mockResolvedValue({
      data,
      fromCache: true,
      cachedAt: new Date("2026-01-01T00:00:00Z"),
    }),
    getCache: jest.fn().mockResolvedValue(data),
    setCache: jest.fn().mockResolvedValue(undefined),
    TTL: {
      LIVE: 60,
      FIXTURES: 1800,
      STANDINGS: 3600,
      SCHEDULE: 86400,
    },
  }));
}
