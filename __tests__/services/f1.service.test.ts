import { F1Service } from "@/services/f1.service";
import { ExternalApiError } from "@/lib/errors";
import { mockFetchSuccess, mockFetchError } from "../helpers/test-utils";

jest.mock("@/lib/cache", () => ({
  withCache: jest.fn((_key: string, _ttl: number, fn: () => unknown) =>
    fn().then((data: unknown) => ({ data, fromCache: false })),
  ),
  TTL: { LIVE: 60, FIXTURES: 1800, STANDINGS: 3600, SCHEDULE: 86400 },
}));

const JOLPICA_SCHEDULE_RESPONSE = {
  MRData: {
    RaceTable: {
      season: "2026",
      Races: [
        {
          season: "2026",
          round: "1",
          raceName: "Australian Grand Prix",
          Circuit: {
            circuitName: "Albert Park Circuit",
            Location: { locality: "Melbourne", country: "Australia" },
          },
          date: "2026-03-15",
          time: "05:00:00Z",
        },
      ],
    },
  },
};

const JOLPICA_STANDINGS_RESPONSE = {
  MRData: {
    StandingsTable: {
      StandingsLists: [
        {
          DriverStandings: [
            {
              position: "1",
              points: "100",
              wins: "4",
              Driver: {
                driverId: "norris",
                code: "NOR",
                permanentNumber: "4",
                givenName: "Lando",
                familyName: "Norris",
                nationality: "British",
              },
              Constructors: [{ name: "McLaren" }],
            },
          ],
        },
      ],
    },
  },
};

describe("F1Service", () => {
  let service: F1Service;

  beforeEach(() => {
    service = new F1Service();
    jest.clearAllMocks();
  });

  describe("getSchedule", () => {
    it("deve retornar lista de corridas da temporada", async () => {
      global.fetch = mockFetchSuccess(JOLPICA_SCHEDULE_RESPONSE);

      const result = await service.getSchedule("2026");

      expect(result.data).toHaveLength(1);
      expect(result.data[0].raceName).toBe("Australian Grand Prix");
      expect(result.data[0].date).toBe("2026-03-15");
    });

    it("deve retornar corrida com circuit, date e time", async () => {
      global.fetch = mockFetchSuccess(JOLPICA_SCHEDULE_RESPONSE);

      const result = await service.getSchedule("2026");
      const race = result.data[0];

      expect(race.circuit.name).toBe("Albert Park Circuit");
      expect(race.circuit.country).toBe("Australia");
      expect(race.time).toBe("05:00:00Z");
    });

    it("deve lançar ExternalApiError quando Jolpica retorna erro", async () => {
      global.fetch = mockFetchError(503);

      await expect(service.getSchedule("2026")).rejects.toThrow(
        ExternalApiError,
      );
    });

    it("deve lançar ExternalApiError quando fetch lança exceção de rede", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("network error"));

      await expect(service.getSchedule("2026")).rejects.toThrow(
        ExternalApiError,
      );
    });

    it("deve chamar a URL correta da Jolpica com a season informada", async () => {
      global.fetch = mockFetchSuccess(JOLPICA_SCHEDULE_RESPONSE);

      await service.getSchedule("2025");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("ergast/f1/2025.json"),
        expect.anything(),
      );
    });
  });

  describe("getDriverStandings", () => {
    it("deve retornar lista de standings de pilotos", async () => {
      global.fetch = mockFetchSuccess(JOLPICA_STANDINGS_RESPONSE);

      const result = await service.getDriverStandings("2026");

      expect(result.data).toHaveLength(1);
      expect(result.data[0].position).toBe("1");
      expect(result.data[0].driver.code).toBe("NOR");
      expect(result.data[0].points).toBe("100");
    });

    it("deve incluir nome do construtor no standing", async () => {
      global.fetch = mockFetchSuccess(JOLPICA_STANDINGS_RESPONSE);

      const result = await service.getDriverStandings("2026");

      expect(result.data[0].driver.constructor).toBe("McLaren");
    });

    it("deve lançar ExternalApiError quando Jolpica retorna erro", async () => {
      global.fetch = mockFetchError(500);

      await expect(service.getDriverStandings("2026")).rejects.toThrow(
        ExternalApiError,
      );
    });
  });

  describe("getNextRace", () => {
    it("deve retornar a próxima corrida agendada", async () => {
      global.fetch = mockFetchSuccess(JOLPICA_SCHEDULE_RESPONSE);

      const result = await service.getNextRace();

      expect(result.data).toBeDefined();
      expect(result.data?.raceName).toBeDefined();
    });

    it("deve retornar null quando não há corridas futuras", async () => {
      const pastResponse = {
        MRData: {
          RaceTable: { season: "2026", Races: [] },
        },
      };
      global.fetch = mockFetchSuccess(pastResponse);

      const result = await service.getNextRace();

      expect(result.data).toBeNull();
    });
  });

  describe("getLastRaceResult", () => {
    it("deve retornar resultado da última corrida", async () => {
      const mockResponse = {
        MRData: {
          RaceTable: {
            Races: [
              {
                raceName: "Australian Grand Prix",
                round: "1",
                date: "2026-03-15",
                Circuit: { circuitName: "Albert Park" },
                Results: [
                  {
                    position: "1",
                    Driver: {
                      code: "NOR",
                      givenName: "Lando",
                      familyName: "Norris",
                    },
                    Constructor: { name: "McLaren" },
                    Time: { time: "1:30:00.000" },
                    status: "Finished",
                    points: "25",
                  },
                ],
              },
            ],
          },
        },
      };
      global.fetch = mockFetchSuccess(mockResponse);

      const result = await service.getLastRaceResult();

      expect(result.data).toBeDefined();
      expect(result.data?.results[0].driverCode).toBe("NOR");
      expect(result.data?.results[0].position).toBe("1");
    });

    it("deve lançar ExternalApiError quando Jolpica retorna erro", async () => {
      global.fetch = mockFetchError(500);

      await expect(service.getLastRaceResult()).rejects.toThrow(
        ExternalApiError,
      );
    });
  });
});
