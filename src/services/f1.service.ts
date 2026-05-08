import type { F1Race, F1Standing, F1RaceResult } from "@/types/f1";

export class F1Service {
  async getSchedule(
    _season: string,
  ): Promise<{ data: F1Race[]; fromCache: boolean }> {
    throw new Error("não implementado");
  }

  async getDriverStandings(
    _season: string,
  ): Promise<{ data: F1Standing[]; fromCache: boolean }> {
    throw new Error("não implementado");
  }

  async getNextRace(): Promise<{ data: F1Race | null; fromCache: boolean }> {
    throw new Error("não implementado");
  }

  async getLastRaceResult(): Promise<{
    data: F1RaceResult | null;
    fromCache: boolean;
  }> {
    throw new Error("não implementado");
  }
}
