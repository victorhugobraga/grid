import { createMockRequest } from "../helpers/test-utils";

jest.mock("@/services/football.service", () => ({
  FootballService: jest.fn().mockImplementation(() => ({
    getStandings: jest.fn().mockResolvedValue({ data: [], fromCache: false }),
    getMatchesByDate: jest
      .fn()
      .mockResolvedValue({ data: [], fromCache: false }),
    getLiveMatches: jest.fn().mockResolvedValue({ data: [], fromCache: false }),
  })),
}));

jest.mock("@/lib/rate-limit", () => ({
  ratelimit: { limit: jest.fn().mockResolvedValue({ success: true }) },
  ratelimitStrict: { limit: jest.fn().mockResolvedValue({ success: false }) },
  getIp: jest.fn().mockReturnValue("127.0.0.1"),
}));

describe("GET /api/football/standings/:league", () => {
  it("deve retornar 200 com standings do Brasileirão", async () => {
    const { GET } = await import("@/app/api/football/standings/[league]/route");
    const req = createMockRequest(
      "http://localhost:3000/api/football/standings/brasileirao",
    );

    const res = await GET(req, {
      params: Promise.resolve({ league: "brasileirao" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("deve retornar 400 quando league é inválida", async () => {
    const { GET } = await import("@/app/api/football/standings/[league]/route");
    const req = createMockRequest(
      "http://localhost:3000/api/football/standings/premier-league",
    );

    const res = await GET(req, {
      params: Promise.resolve({ league: "premier-league" }),
    });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/football/schedule", () => {
  it("deve retornar 200 com partidas do dia", async () => {
    const { GET } = await import("@/app/api/football/schedule/route");
    const req = createMockRequest(
      "http://localhost:3000/api/football/schedule?date=2026-05-10",
    );

    const res = await GET(req);

    expect(res.status).toBe(200);
  });

  it("deve retornar 200 sem date (usa hoje como default)", async () => {
    const { GET } = await import("@/app/api/football/schedule/route");
    const req = createMockRequest(
      "http://localhost:3000/api/football/schedule",
    );

    const res = await GET(req);

    expect(res.status).toBe(200);
  });

  it("deve retornar 400 quando date está em formato inválido", async () => {
    const { GET } = await import("@/app/api/football/schedule/route");
    const req = createMockRequest(
      "http://localhost:3000/api/football/schedule?date=10-05-2026",
    );

    const res = await GET(req);

    expect(res.status).toBe(400);
  });
});
