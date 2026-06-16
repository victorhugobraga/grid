import { FootballService } from "@/services/football.service";
import { mockFetchSuccess, mockFetchError } from "../helpers/test-utils";

jest.mock("@/lib/cache", () => ({
  withCache: jest.fn((_key: string, _ttl: number, fn: () => unknown) =>
    fn().then((data: unknown) => ({ data, fromCache: false })),
  ),
  TTL: { LIVE: 60, FIXTURES: 1800, STANDINGS: 3600, SCHEDULE: 86400 },
}));

const ESPN_STANDINGS_RESPONSE = {
  children: [
    {
      standings: {
        entries: [
          {
            team: {
              id: "119",
              displayName: "Flamengo",
              logos: [{ href: "https://a.espncdn.com/logo.png" }],
            },
            stats: [
              { name: "rank", value: 1 },
              { name: "points", value: 45 },
              { name: "gamesPlayed", value: 15 },
              { name: "wins", value: 14 },
              { name: "ties", value: 3 },
              { name: "losses", value: 0 },
              { name: "pointsFor", value: 30 },
              { name: "pointsAgainst", value: 5 },
              { name: "pointDifferential", value: 25 },
            ],
          },
        ],
      },
    },
  ],
};

function makeESPNEvent(
  id: string,
  state: "pre" | "in" | "post",
  statusName = "STATUS_SCHEDULED",
  homeScore = "",
  awayScore = "",
) {
  return {
    id,
    date: "2026-05-10T18:00:00Z",
    competitions: [
      {
        status: {
          displayClock: state === "in" ? "55:00" : "0:00",
          type: { state, name: statusName },
        },
        competitors: [
          {
            homeAway: "home",
            team: { id: "119", displayName: "Flamengo", logo: "https://..." },
            score: homeScore,
          },
          {
            homeAway: "away",
            team: {
              id: "131",
              displayName: "Atletico Mineiro",
              logo: "https://...",
            },
            score: awayScore,
          },
        ],
        notes: [],
      },
    ],
  };
}

const ESPN_SCOREBOARD_NS = {
  leagues: [{ id: "4328", name: "Brasileirao Serie A" }],
  events: [makeESPNEvent("12345", "pre")],
};

describe("FootballService", () => {
  let service: FootballService;

  beforeEach(() => {
    service = new FootballService();
    jest.clearAllMocks();
  });

  describe("getStandings", () => {
    it("deve retornar standings do Brasileirão", async () => {
      global.fetch = mockFetchSuccess(ESPN_STANDINGS_RESPONSE);

      const result = await service.getStandings("brasileirao");

      expect(result.data).toHaveLength(1);
      expect(result.data[0].rank).toBe(1);
      expect(result.data[0].team.name).toBe("Flamengo");
      expect(result.data[0].points).toBe(45);
    });

    it("deve mapear corretamente won/drawn/lost do formato da API", async () => {
      global.fetch = mockFetchSuccess(ESPN_STANDINGS_RESPONSE);

      const result = await service.getStandings("brasileirao");

      expect(result.data[0].won).toBe(14);
      expect(result.data[0].drawn).toBe(3);
      expect(result.data[0].lost).toBe(0);
    });

    it("deve aceitar todas as ligas suportadas", async () => {
      global.fetch = mockFetchSuccess(ESPN_STANDINGS_RESPONSE);

      const ligas = [
        "brasileirao",
        "copa-brasil",
        "champions",
        "worldcup",
      ] as const;
      for (const liga of ligas) {
        await expect(service.getStandings(liga)).resolves.toBeDefined();
      }
    });

    it("deve retornar array vazio quando ESPN falha", async () => {
      global.fetch = mockFetchError(429);

      const result = await service.getStandings("brasileirao");
      expect(result.data).toHaveLength(0);
    });

    it("deve chamar ESPN com slug correto para o Brasileirão", async () => {
      global.fetch = mockFetchSuccess(ESPN_STANDINGS_RESPONSE);

      await service.getStandings("brasileirao");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("bra.1/standings"),
        expect.anything(),
      );
    });
  });

  describe("getMatchesByDate", () => {
    it("deve retornar partidas do dia informado", async () => {
      // fetch é chamado 4 vezes (um por slug ESPN); todas retornam o mesmo evento;
      // o dedupe por ID mantém apenas 1.
      global.fetch = mockFetchSuccess(ESPN_SCOREBOARD_NS);

      const result = await service.getMatchesByDate("2026-05-10");

      expect(result.data).toHaveLength(1);
      expect(result.data[0].home.name).toBe("Flamengo");
      expect(result.data[0].away.name).toBe("Atletico Mineiro");
    });

    it("deve retornar lista vazia quando não há partidas", async () => {
      global.fetch = mockFetchSuccess({ events: [] });

      const result = await service.getMatchesByDate("2026-05-10");

      expect(result.data).toHaveLength(0);
    });

    it("deve mapear status da partida corretamente", async () => {
      global.fetch = mockFetchSuccess(ESPN_SCOREBOARD_NS);

      const result = await service.getMatchesByDate("2026-05-10");

      expect(result.data[0].status.short).toBe("NS");
    });

    it("deve retornar array vazio quando ESPN falha", async () => {
      global.fetch = mockFetchError(500);

      const result = await service.getMatchesByDate("2026-05-10");
      expect(result.data).toHaveLength(0);
    });

    it("deve converter data YYYY-MM-DD para YYYYMMDD na query ESPN", async () => {
      global.fetch = mockFetchSuccess({ events: [] });

      await service.getMatchesByDate("2026-05-10");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("dates=20260510"),
        expect.anything(),
      );
    });
  });

  describe("getLiveMatches", () => {
    it("deve retornar apenas partidas com status LIVE ou HT", async () => {
      const liveResponse = {
        leagues: [{ id: "4328", name: "Brasileirao Serie A" }],
        events: [
          makeESPNEvent("1", "in", "STATUS_IN_PROGRESS", "1", "0"),
          makeESPNEvent("2", "pre"),
        ],
      };
      global.fetch = mockFetchSuccess(liveResponse);

      const result = await service.getLiveMatches();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].status.short).toBe("LIVE");
    });

    it("deve retornar lista vazia quando não há partidas ao vivo", async () => {
      global.fetch = mockFetchSuccess({ events: [] });

      const result = await service.getLiveMatches();

      expect(result.data).toHaveLength(0);
    });
  });
});
