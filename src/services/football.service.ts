import { withCache, TTL } from "@/lib/cache";
import { fetcher } from "@/lib/fetcher";
import { ESPN_SLUGS, FLAMENGO_EXTRA_SLUGS } from "@/lib/constants";
import type { FootballMatch, FootballStanding, League } from "@/types/football";

// standings usa /apis/v2; scoreboard exige /apis/site/v2
const ESPN_STANDINGS_BASE = "https://site.api.espn.com/apis/v2/sports/soccer";
const ESPN_SCOREBOARD_BASE =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

const LEAGUE_TO_ESPN_SLUG: Record<League, string> = {
  brasileirao: ESPN_SLUGS.BRASILEIRAO,
  "copa-brasil": ESPN_SLUGS.COPA_BRASIL,
  champions: ESPN_SLUGS.CHAMPIONS,
  worldcup: ESPN_SLUGS.WORLD_CUP,
};

function mapStatus(
  state: string,
  name: string,
): FootballMatch["status"]["short"] {
  if (name === "STATUS_HALFTIME") return "HT";
  if (name === "STATUS_POSTPONED") return "PST";
  if (name === "STATUS_CANCELED" || name === "STATUS_CANCELLED") return "CANC";
  if (state === "in") return "LIVE";
  if (state === "post") return "FT";
  return "NS";
}

function parseESPNEvent(
  event: Record<string, unknown>,
  leagueInfo: { id: number; name: string },
): FootballMatch {
  const competitions = event.competitions as Record<string, unknown>[];
  const comp = competitions[0];

  const statusBlock = comp.status as Record<string, unknown>;
  const statusType = statusBlock.type as Record<string, unknown>;
  const state = statusType.state as string;
  const statusName = statusType.name as string;
  const shortStatus = mapStatus(state, statusName);

  const displayClock = statusBlock.displayClock as string | undefined;
  const elapsed =
    state === "in" && displayClock
      ? parseInt(displayClock.replace("'", "").split(":")[0], 10)
      : undefined;

  const competitors = comp.competitors as Record<string, unknown>[];
  const homeComp =
    competitors.find((c) => c.homeAway === "home") ?? competitors[0];
  const awayComp =
    competitors.find((c) => c.homeAway === "away") ?? competitors[1];

  const homeTeam = homeComp.team as Record<string, unknown>;
  const awayTeam = awayComp.team as Record<string, unknown>;

  const parseGoals = (c: Record<string, unknown>): number | null => {
    if (state !== "in" && state !== "post") return null;
    const score = c.score as string | undefined;
    return score != null && score !== "" ? parseInt(score, 10) : null;
  };

  const notes = comp.notes as Record<string, unknown>[] | undefined;
  const round = (notes?.[0]?.headline as string | undefined) ?? "";

  return {
    id: parseInt(event.id as string, 10),
    date: event.date as string,
    status: { short: shortStatus, elapsed },
    league: { id: leagueInfo.id, name: leagueInfo.name, round },
    home: {
      id: parseInt(homeTeam.id as string, 10),
      name: homeTeam.displayName as string,
      logo: homeTeam.logo as string | undefined,
      goals: parseGoals(homeComp),
    },
    away: {
      id: parseInt(awayTeam.id as string, 10),
      name: awayTeam.displayName as string,
      logo: awayTeam.logo as string | undefined,
      goals: parseGoals(awayComp),
    },
  };
}

async function fetchScoreboardFromESPN(
  slug: string,
  dates?: string,
): Promise<FootballMatch[]> {
  const url = dates
    ? `${ESPN_SCOREBOARD_BASE}/${slug}/scoreboard?dates=${dates}`
    : `${ESPN_SCOREBOARD_BASE}/${slug}/scoreboard`;

  const json = await fetcher<Record<string, unknown>>(url, "ESPN");

  const leagues = (json.leagues as Record<string, unknown>[]) ?? [];
  const leagueInfo = leagues[0] as Record<string, unknown> | undefined;
  const leagueName = (leagueInfo?.name as string | undefined) ?? slug;
  const leagueId = parseInt((leagueInfo?.id as string | undefined) ?? "0", 10);

  const events = (json.events as Record<string, unknown>[]) ?? [];

  return events.flatMap((event) => {
    try {
      return [parseESPNEvent(event, { id: leagueId, name: leagueName })];
    } catch {
      return [];
    }
  });
}

async function fetchStandingsFromESPN(
  slug: string,
): Promise<FootballStanding[]> {
  const json = await fetcher<Record<string, unknown>>(
    `${ESPN_STANDINGS_BASE}/${slug}/standings`,
    "ESPN",
  );

  const children = json.children as Record<string, unknown>[] | undefined;
  if (!children?.length) return [];

  const standingsBlock = children[0].standings as Record<string, unknown>;
  const entries = (standingsBlock.entries as Record<string, unknown>[]) ?? [];

  return entries.map((entry) => {
    const team = entry.team as Record<string, unknown>;
    const stats = entry.stats as Record<string, unknown>[];

    const getStat = (name: string): number => {
      const found = stats.find((s) => s.name === name);
      return found ? (found.value as number) : 0;
    };

    const logos = team.logos as { href: string }[] | undefined;

    return {
      rank: getStat("rank"),
      team: {
        id: Number(team.id),
        name: team.displayName as string,
        logo: logos?.[0]?.href ?? "",
      },
      points: getStat("points"),
      played: getStat("gamesPlayed"),
      won: getStat("wins"),
      drawn: getStat("ties"),
      lost: getStat("losses"),
      goalsFor: getStat("pointsFor"),
      goalsAgainst: getStat("pointsAgainst"),
      goalsDiff: getStat("pointDifferential"),
    };
  });
}

function dedupeMatches(matches: FootballMatch[]): FootballMatch[] {
  const seen = new Set<number>();
  return matches.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export class FootballService {
  async getStandings(league: League): Promise<{
    data: FootballStanding[];
    fromCache: boolean;
    cachedAt?: Date;
  }> {
    const slug = LEAGUE_TO_ESPN_SLUG[league];

    return withCache(
      `football:standings:${league}:espn`,
      TTL.STANDINGS,
      async () => {
        try {
          return await fetchStandingsFromESPN(slug);
        } catch {
          return [];
        }
      },
    );
  }

  async getMatchesByDate(
    date: string,
  ): Promise<{ data: FootballMatch[]; fromCache: boolean; cachedAt?: Date }> {
    return withCache(`football:matches:${date}`, TTL.FIXTURES, async () => {
      const espnDate = date.replace(/-/g, "");

      const results = await Promise.allSettled(
        Object.values(ESPN_SLUGS).map((slug) =>
          fetchScoreboardFromESPN(slug, espnDate),
        ),
      );

      return dedupeMatches(
        results
          .filter(
            (r): r is PromiseFulfilledResult<FootballMatch[]> =>
              r.status === "fulfilled",
          )
          .flatMap((r) => r.value),
      );
    });
  }

  async getLiveMatches(): Promise<{
    data: FootballMatch[];
    fromCache: boolean;
    cachedAt?: Date;
  }> {
    return withCache("football:live", TTL.LIVE, async () => {
      const results = await Promise.allSettled(
        Object.values(ESPN_SLUGS).map((slug) => fetchScoreboardFromESPN(slug)),
      );

      return dedupeMatches(
        results
          .filter(
            (r): r is PromiseFulfilledResult<FootballMatch[]> =>
              r.status === "fulfilled",
          )
          .flatMap((r) => r.value),
      ).filter((m) => m.status.short === "LIVE" || m.status.short === "HT");
    });
  }

  async getFlamengoUpcoming(): Promise<{
    data: FootballMatch[];
    fromCache: boolean;
    cachedAt?: Date;
  }> {
    return withCache("football:flamengo:upcoming", TTL.FIXTURES, async () => {
      const today = new Date();
      const end = new Date(today);
      end.setDate(end.getDate() + 14);

      const fmt = (d: Date) => d.toISOString().split("T")[0].replace(/-/g, "");
      const dateRange = `${fmt(today)}-${fmt(end)}`;

      const allSlugs = [...Object.values(ESPN_SLUGS), ...FLAMENGO_EXTRA_SLUGS];

      const results = await Promise.allSettled(
        allSlugs.map((slug) => fetchScoreboardFromESPN(slug, dateRange)),
      );

      const isFlamengo = (m: FootballMatch) =>
        m.home.name.toLowerCase().includes("flamengo") ||
        m.away.name.toLowerCase().includes("flamengo");

      return dedupeMatches(
        results
          .filter(
            (r): r is PromiseFulfilledResult<FootballMatch[]> =>
              r.status === "fulfilled",
          )
          .flatMap((r) => r.value),
      )
        .filter((m) => isFlamengo(m) && m.status.short === "NS")
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);
    });
  }
}
