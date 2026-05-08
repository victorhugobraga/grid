import { createMockRequest } from "../helpers/test-utils";

jest.mock("@/services/f1.service", () => ({
  F1Service: jest.fn().mockImplementation(() => ({
    getSchedule: jest.fn().mockResolvedValue({
      data: [],
      fromCache: false,
    }),
    getDriverStandings: jest.fn().mockResolvedValue({
      data: [],
      fromCache: false,
    }),
    getNextRace: jest.fn().mockResolvedValue({
      data: null,
      fromCache: false,
    }),
    getLastRaceResult: jest.fn().mockResolvedValue({
      data: null,
      fromCache: false,
    }),
  })),
}));

jest.mock("@/lib/rate-limit", () => ({
  ratelimit: { limit: jest.fn().mockResolvedValue({ success: true }) },
  ratelimitStrict: { limit: jest.fn().mockResolvedValue({ success: true }) },
  getIp: jest.fn().mockReturnValue("127.0.0.1"),
}));

describe("GET /api/f1/schedule", () => {
  it("deve retornar 200 com lista de corridas", async () => {
    const { GET } = await import("@/app/api/f1/schedule/route");
    const req = createMockRequest(
      "http://localhost:3000/api/f1/schedule?season=2026",
    );

    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("deve retornar 400 quando season é inválida", async () => {
    const { GET } = await import("@/app/api/f1/schedule/route");
    const req = createMockRequest(
      "http://localhost:3000/api/f1/schedule?season=abc",
    );

    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("deve retornar 429 quando rate limit excedido", async () => {
    jest.resetModules();
    jest.mock("@/lib/rate-limit", () => ({
      ratelimit: { limit: jest.fn().mockResolvedValue({ success: false }) },
      ratelimitStrict: {
        limit: jest.fn().mockResolvedValue({ success: false }),
      },
      getIp: jest.fn().mockReturnValue("127.0.0.1"),
    }));

    const { GET } = await import("@/app/api/f1/schedule/route");
    const req = createMockRequest(
      "http://localhost:3000/api/f1/schedule?season=2026",
    );

    const res = await GET(req);

    expect(res.status).toBe(429);
  });
});

describe("GET /api/f1/standings", () => {
  it("deve retornar 200 com standings de pilotos", async () => {
    const { GET } = await import("@/app/api/f1/standings/route");
    const req = createMockRequest("http://localhost:3000/api/f1/standings");

    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
