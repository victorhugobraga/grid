"use client";

import useSWR from "swr";
import type { ApiResponse } from "@/types/api";
import type { F1Race, F1Standing, F1RaceResult } from "@/types/f1";
import type { FootballMatch, FootballStanding } from "@/types/football";
import type { League } from "@/types/football";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) throw new Error("API error");
  return json.data;
}

export type LiveStateData = {
  state: string;
  pollingInterval: number;
  pollingIntervalLabel: string;
};

export function useLiveState() {
  const { data } = useSWR("/api/live/state", fetcher<LiveStateData>, {
    refreshInterval: 5 * 60 * 1000,
  });
  return (
    data ?? {
      state: "idle",
      pollingInterval: 6 * 60 * 60 * 1000,
      pollingIntervalLabel: "6h",
    }
  );
}

export function useF1Schedule() {
  const year = new Date().getFullYear();
  const { data } = useSWR(
    `/api/f1/schedule?season=${year}`,
    fetcher<F1Race[]>,
    { refreshInterval: 60 * 60 * 1000 },
  );

  const today = new Date().toISOString().split("T")[0];
  const nextRace = data?.find((r) => r.date >= today) ?? null;

  return { schedule: data ?? [], nextRace };
}

export function useFootballToday() {
  const { data } = useSWR("/api/football/schedule", fetcher<FootballMatch[]>, {
    refreshInterval: 30 * 60 * 1000,
    onErrorRetry: () => {},
  });
  return data ?? [];
}

export function useFootballLive() {
  const { data } = useSWR("/api/football/live", fetcher<FootballMatch[]>, {
    refreshInterval: 60 * 1000,
    onErrorRetry: () => {},
  });
  return data ?? [];
}

export function useF1Standings() {
  const { data } = useSWR("/api/f1/standings", fetcher<F1Standing[]>, {
    refreshInterval: 60 * 60 * 1000,
    onErrorRetry: () => {},
  });
  return data ?? [];
}

export function useF1LastResult() {
  const { data } = useSWR("/api/f1/results", fetcher<F1RaceResult | null>, {
    refreshInterval: 60 * 60 * 1000,
    onErrorRetry: () => {},
  });
  return data ?? null;
}

export function useFootballStandings(league: League) {
  const { data } = useSWR(
    `/api/football/standings/${league}`,
    fetcher<FootballStanding[]>,
    {
      refreshInterval: 60 * 60 * 1000,
      onErrorRetry: () => {},
    },
  );
  return data ?? [];
}
