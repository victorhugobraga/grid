import type { FootballMatch, FootballStanding, League } from "@/types/football";

export class FootballService {
  async getStandings(
    _league: League,
  ): Promise<{ data: FootballStanding[]; fromCache: boolean }> {
    throw new Error("não implementado");
  }

  async getMatchesByDate(
    _date: string,
  ): Promise<{ data: FootballMatch[]; fromCache: boolean }> {
    throw new Error("não implementado");
  }

  async getLiveMatches(): Promise<{
    data: FootballMatch[];
    fromCache: boolean;
  }> {
    throw new Error("não implementado");
  }
}
