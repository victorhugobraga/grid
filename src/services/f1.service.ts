import { withCache, TTL } from "@/lib/cache";
import { ExternalApiError } from "@/lib/errors";
import type { F1Race, F1Standing, F1RaceResult } from "@/types/f1";

const JOLPICA_BASE = "https://api.jolpi.ca/ergast/f1";

async function jolpicaFetch<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${JOLPICA_BASE}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new ExternalApiError("Jolpica-F1", `Status ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ExternalApiError) throw err;
    throw new ExternalApiError("Jolpica-F1", "Erro de rede");
  }
}

function parseRace(raw: Record<string, unknown>): F1Race {
  const circuit = raw.Circuit as Record<string, unknown>;
  const location = circuit.Location as Record<string, unknown>;

  return {
    season: raw.season as string,
    round: raw.round as string,
    raceName: raw.raceName as string,
    circuit: {
      name: circuit.circuitName as string,
      location: location.locality as string,
      country: location.country as string,
    },
    date: raw.date as string,
    time: raw.time as string | undefined,
  };
}

export class F1Service {
  async getSchedule(
    season: string,
  ): Promise<{ data: F1Race[]; fromCache: boolean; cachedAt?: Date }> {
    return withCache(`f1:schedule:${season}`, TTL.SCHEDULE, async () => {
      const json = await jolpicaFetch<Record<string, unknown>>(
        `/${season}.json`,
      );
      const mrData = json.MRData as Record<string, unknown>;
      const raceTable = mrData.RaceTable as Record<string, unknown>;
      const races = (raceTable.Races as Record<string, unknown>[]) ?? [];
      return races.map(parseRace);
    });
  }

  async getDriverStandings(
    season: string,
  ): Promise<{ data: F1Standing[]; fromCache: boolean; cachedAt?: Date }> {
    return withCache(
      `f1:standings:drivers:${season}`,
      TTL.STANDINGS,
      async () => {
        const json = await jolpicaFetch<Record<string, unknown>>(
          `/${season}/driverStandings.json`,
        );
        const mrData = json.MRData as Record<string, unknown>;
        const standingsTable = mrData.StandingsTable as Record<string, unknown>;
        const lists =
          (standingsTable.StandingsLists as Record<string, unknown>[]) ?? [];
        const driverStandings =
          (lists[0]?.DriverStandings as Record<string, unknown>[]) ?? [];

        return driverStandings.map((s) => {
          const driver = s.Driver as Record<string, unknown>;
          const constructors = s.Constructors as Record<string, unknown>[];
          return {
            position: s.position as string,
            points: s.points as string,
            wins: s.wins as string,
            driver: {
              driverId: driver.driverId as string,
              code: driver.code as string,
              number: driver.permanentNumber as string,
              givenName: driver.givenName as string,
              familyName: driver.familyName as string,
              nationality: driver.nationality as string,
              constructor: (constructors[0]?.name as string) ?? "",
            },
          };
        });
      },
    );
  }

  async getNextRace(): Promise<{
    data: F1Race | null;
    fromCache: boolean;
    cachedAt?: Date;
  }> {
    return withCache("f1:next-race", TTL.FIXTURES, async () => {
      const json =
        await jolpicaFetch<Record<string, unknown>>("/current/next.json");
      const mrData = json.MRData as Record<string, unknown>;
      const raceTable = mrData.RaceTable as Record<string, unknown>;
      const races = (raceTable.Races as Record<string, unknown>[]) ?? [];
      return races.length > 0 ? parseRace(races[0]) : null;
    });
  }

  async getLastRaceResult(): Promise<{
    data: F1RaceResult | null;
    fromCache: boolean;
    cachedAt?: Date;
  }> {
    return withCache("f1:last-result", TTL.STANDINGS, async () => {
      const json = await jolpicaFetch<Record<string, unknown>>(
        "/current/last/results.json",
      );
      const mrData = json.MRData as Record<string, unknown>;
      const raceTable = mrData.RaceTable as Record<string, unknown>;
      const races = (raceTable.Races as Record<string, unknown>[]) ?? [];

      if (races.length === 0) return null;

      const race = races[0] as Record<string, unknown>;
      const circuit = race.Circuit as Record<string, unknown>;
      const results = (race.Results as Record<string, unknown>[]) ?? [];

      return {
        round: race.round as string,
        raceName: race.raceName as string,
        date: race.date as string,
        circuit: circuit.circuitName as string,
        results: results.map((r) => {
          const driver = r.Driver as Record<string, unknown>;
          const constructor = r.Constructor as Record<string, unknown>;
          const time = r.Time as Record<string, unknown> | undefined;
          const fastestLap = r.FastestLap as
            | Record<string, unknown>
            | undefined;
          const fastestLapTime = fastestLap?.Time as
            | Record<string, unknown>
            | undefined;

          return {
            position: r.position as string,
            driverCode: driver.code as string,
            driverName: `${driver.givenName} ${driver.familyName}`,
            constructor: constructor.name as string,
            time: time?.time as string | undefined,
            status: r.status as string,
            points: r.points as string,
            fastestLap: fastestLap
              ? {
                  rank: fastestLap.rank as string,
                  time: fastestLapTime?.time as string,
                }
              : undefined,
          };
        }),
      };
    });
  }
}
