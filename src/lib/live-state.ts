import { redis } from "./redis";

export type LiveState = "idle" | "pre-event" | "live" | "post-event";

const STATE_KEY = "grid:live:state";
const STATE_TTL = 5 * 60; // 5 minutos

export const POLLING_INTERVALS: Record<LiveState, number> = {
  idle: 6 * 60 * 60 * 1000,
  "pre-event": 5 * 60 * 1000,
  live: 60 * 1000,
  "post-event": 60 * 1000,
};

export async function getLiveState(): Promise<LiveState> {
  try {
    const cached = await redis.get<LiveState>(STATE_KEY);
    if (cached) return cached;
  } catch {
    // falha silenciosa — retorna idle como default seguro
  }
  return "idle";
}

export async function setLiveState(state: LiveState): Promise<void> {
  try {
    await redis.set(STATE_KEY, state, { ex: STATE_TTL });
  } catch {
    // falha silenciosa
  }
}

export function calculateState(
  now: Date,
  eventWindows: Array<{ start: string; end: string }>,
): LiveState {
  for (const window of eventWindows) {
    const start = new Date(window.start);
    const end = new Date(window.end);
    const twoHoursBefore = new Date(start.getTime() - 2 * 60 * 60 * 1000);
    const oneHourAfter = new Date(end.getTime() + 60 * 60 * 1000);

    if (now >= start && now <= end) return "live";
    if (now >= twoHoursBefore && now < start) return "pre-event";
    if (now > end && now <= oneHourAfter) return "post-event";
  }
  return "idle";
}
