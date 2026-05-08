import { withCache, TTL } from "@/lib/cache";
import { ExternalApiError } from "@/lib/errors";
import { LEAGUE_IDS } from "@/lib/constants";
import type { FootballMatch, FootballStanding, League } from "@/types/football";

const API_FOOTBALL_BASE = "https://v3.football.api-sports.io";

async function apiFootballFetch<T>(path: string): Promise<T> {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    throw new ExternalApiError("API-Football", "API key não configurada");
  }

  try {
    const res = await fetch(`${API_FOOTBALL_BASE}${path}`, {
      headers: {
        "x-apisports-key": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new ExternalApiError("API-Football", `Status ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ExternalApiError) throw err;
    throw new ExternalApiError("API-Football", "Erro de rede");
  }
}

function parseMatch(raw: Record<string, unknown>): FootballMatch {
  const fixture = raw.fixture as Record<string, unknown>;
  const status = fixture.status as Record<string, unknown>;
  const league = raw.league as Record<string, unknown>;
  const teams = raw.teams as Record<string, unknown>;
  const home = teams.home as Record<string, unknown>;
  const away = teams.away as Record<string, unknown>;

  return {
    id: fixture.id as number,
    date: fixture.date as string,
    status: {
      short: status.short as FootballMatch["status"]["short"],
      elapsed: status.elapsed as number | undefined,
    },
    league: {
      id: league.id as number,
      name: league.name as string,
      round: league.round as string,
    },
    home: {
      id: home.id as number,
      name: home.name as string,
      logo: home.logo as string,
      goals: home.goals as number | null,
    },
    away: {
      id: away.id as number,
      name: away.name as string,
      logo: away.logo as string,
      goals: away.goals as number | null,
    },
  };
}

export class FootballService {
  async getStandings(
    league: League,
  ): Promise<{
    data: FootballStanding[];
    fromCache: boolean;
    cachedAt?: Date;
  }> {
    const leagueId =
      LEAGUE_IDS[league.toUpperCase() as keyof typeof LEAGUE_IDS];
    const season = new Date().getFullYear();

    return withCache(
      `football:standings:${league}:${season}`,
      TTL.STANDINGS,
      async () => {
        const json = await apiFootballFetch<Record<string, unknown>>(
          `/standings?league=${leagueId}&season=${season}`,
        );
        const response = (json.response as Record<string, unknown>[]) ?? [];

        if (response.length === 0) return [];

        const leagueData = response[0].league as Record<string, unknown>;
        const standingsGroups = leagueData.standings as Record<
          string,
          unknown
        >[][];
        const standings = standingsGroups[0] ?? [];

        return standings.map((s) => {
          const team = s.team as Record<string, unknown>;
          const all = s.all as Record<string, unknown>;

          return {
            rank: s.rank as number,
            team: {
              id: team.id as number,
              name: team.name as string,
              logo: team.logo as string,
            },
            points: s.points as number,
            played: all.played as number,
            won: all.win as number,
            drawn: all.draw as number,
            lost: all.lose as number,
            goalsFor:
              (all.goals as Record<string, number> | undefined)?.for ?? 0,
            goalsAgainst:
              (all.goals as Record<string, number> | undefined)?.against ?? 0,
            goalsDiff: s.goalsDiff as number,
            form: s.form as string | undefined,
          };
        });
      },
    );
  }

  async getMatchesByDate(
    date: string,
  ): Promise<{ data: FootballMatch[]; fromCache: boolean; cachedAt?: Date }> {
    return withCache(`football:matches:${date}`, TTL.FIXTURES, async () => {
      const json = await apiFootballFetch<Record<string, unknown>>(
        `/fixtures?date=${date}`,
      );
      const response = (json.response as Record<string, unknown>[]) ?? [];
      return response.map(parseMatch);
    });
  }

  async getLiveMatches(): Promise<{
    data: FootballMatch[];
    fromCache: boolean;
    cachedAt?: Date;
  }> {
    return withCache("football:live", TTL.LIVE, async () => {
      const json =
        await apiFootballFetch<Record<string, unknown>>("/fixtures?live=all");
      const response = (json.response as Record<string, unknown>[]) ?? [];
      const all = response.map(parseMatch);
      return all.filter(
        (m) => m.status.short === "LIVE" || m.status.short === "HT",
      );
    });
  }
}
