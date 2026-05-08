import { FootballService } from "@/services/football.service";
import { ExternalApiError } from "@/lib/errors";
import { mockFetchSuccess, mockFetchError } from "../helpers/test-utils";

jest.mock("@/lib/cache", () => ({
  withCache: jest.fn((_key: string, _ttl: number, fn: () => unknown) =>
    fn().then((data: unknown) => ({ data, fromCache: false })),
  ),
  TTL: { LIVE: 60, FIXTURES: 1800, STANDINGS: 3600, SCHEDULE: 86400 },
}));

const API_FOOTBALL_STANDINGS_RESPONSE = {
  response: [
    {
      league: {
        standings: [
          [
            {
              rank: 1,
              team: { id: 119, name: "Flamengo", logo: "https://..." },
              points: 45,
              all: { played: 15, win: 14, draw: 3, lose: 0 },
              goalsDiff: 25,
              form: "WWWWW",
            },
          ],
        ],
      },
    },
  ],
};

const API_FOOTBALL_FIXTURES_RESPONSE = {
  response: [
    {
      fixture: {
        id: 12345,
        date: "2026-05-10T18:00:00+00:00",
        status: { short: "NS", elapsed: null },
      },
      league: {
        id: 71,
        name: "Brasileirao Serie A",
        round: "Regular Season - 10",
      },
      teams: {
        home: { id: 119, name: "Flamengo", logo: "https://...", goals: null },
        away: {
          id: 131,
          name: "Atletico Mineiro",
          logo: "https://...",
          goals: null,
        },
      },
    },
  ],
};

describe("FootballService", () => {
  let service: FootballService;

  beforeEach(() => {
    service = new FootballService();
    jest.clearAllMocks();
  });

  describe("getStandings", () => {
    it("deve retornar standings do Brasileirão", async () => {
      global.fetch = mockFetchSuccess(API_FOOTBALL_STANDINGS_RESPONSE);

      const result = await service.getStandings("brasileirao");

      expect(result.data).toHaveLength(1);
      expect(result.data[0].rank).toBe(1);
      expect(result.data[0].team.name).toBe("Flamengo");
      expect(result.data[0].points).toBe(45);
    });

    it("deve mapear corretamente won/drawn/lost do formato da API", async () => {
      global.fetch = mockFetchSuccess(API_FOOTBALL_STANDINGS_RESPONSE);

      const result = await service.getStandings("brasileirao");

      expect(result.data[0].won).toBe(14);
      expect(result.data[0].drawn).toBe(3);
      expect(result.data[0].lost).toBe(0);
    });

    it("deve aceitar todas as ligas suportadas", async () => {
      global.fetch = mockFetchSuccess(API_FOOTBALL_STANDINGS_RESPONSE);

      const ligas = [
        "brasileirao",
        "libertadores",
        "champions",
        "worldcup",
      ] as const;
      for (const liga of ligas) {
        await expect(service.getStandings(liga)).resolves.toBeDefined();
      }
    });

    it("deve lançar ExternalApiError quando API-Football retorna erro", async () => {
      global.fetch = mockFetchError(429);

      await expect(service.getStandings("brasileirao")).rejects.toThrow(
        ExternalApiError,
      );
    });

    it("deve usar ID correto da liga ao chamar a API", async () => {
      global.fetch = mockFetchSuccess(API_FOOTBALL_STANDINGS_RESPONSE);

      await service.getStandings("brasileirao");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("league=71"),
        expect.anything(),
      );
    });
  });

  describe("getMatchesByDate", () => {
    it("deve retornar partidas do dia informado", async () => {
      global.fetch = mockFetchSuccess(API_FOOTBALL_FIXTURES_RESPONSE);

      const result = await service.getMatchesByDate("2026-05-10");

      expect(result.data).toHaveLength(1);
      expect(result.data[0].home.name).toBe("Flamengo");
      expect(result.data[0].away.name).toBe("Atletico Mineiro");
    });

    it("deve retornar lista vazia quando não há partidas", async () => {
      global.fetch = mockFetchSuccess({ response: [] });

      const result = await service.getMatchesByDate("2026-05-10");

      expect(result.data).toHaveLength(0);
    });

    it("deve mapear status da partida corretamente", async () => {
      global.fetch = mockFetchSuccess(API_FOOTBALL_FIXTURES_RESPONSE);

      const result = await service.getMatchesByDate("2026-05-10");

      expect(result.data[0].status.short).toBe("NS");
    });

    it("deve lançar ExternalApiError quando API-Football retorna erro", async () => {
      global.fetch = mockFetchError(500);

      await expect(service.getMatchesByDate("2026-05-10")).rejects.toThrow(
        ExternalApiError,
      );
    });
  });

  describe("getLiveMatches", () => {
    it("deve retornar apenas partidas com status LIVE ou HT", async () => {
      const liveResponse = {
        response: [
          {
            fixture: {
              id: 1,
              date: "2026-05-10T18:00:00Z",
              status: { short: "LIVE", elapsed: 55 },
            },
            league: { id: 71, name: "Brasileirao", round: "Round 10" },
            teams: {
              home: { id: 119, name: "Flamengo", logo: "", goals: 1 },
              away: { id: 131, name: "Atletico", logo: "", goals: 0 },
            },
          },
          {
            fixture: {
              id: 2,
              date: "2026-05-10T20:00:00Z",
              status: { short: "NS", elapsed: null },
            },
            league: { id: 71, name: "Brasileirao", round: "Round 10" },
            teams: {
              home: { id: 120, name: "Palmeiras", logo: "", goals: null },
              away: { id: 132, name: "Santos", logo: "", goals: null },
            },
          },
        ],
      };
      global.fetch = mockFetchSuccess(liveResponse);

      const result = await service.getLiveMatches();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].status.short).toBe("LIVE");
    });

    it("deve retornar lista vazia quando não há partidas ao vivo", async () => {
      global.fetch = mockFetchSuccess({ response: [] });

      const result = await service.getLiveMatches();

      expect(result.data).toHaveLength(0);
    });
  });
});
