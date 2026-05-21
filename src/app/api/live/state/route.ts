import { withHandler, ok } from "@/lib/api";
import { getLiveState, POLLING_INTERVALS } from "@/lib/live-state";

function formatInterval(ms: number): string {
  if (ms >= 3600000) return `${ms / 3600000}h`;
  if (ms >= 60000) return `${ms / 60000}min`;
  return `${ms / 1000}s`;
}

export const GET = withHandler(async () => {
  const state = await getLiveState();
  const interval = POLLING_INTERVALS[state];

  return ok({
    state,
    pollingInterval: interval,
    pollingIntervalLabel: formatInterval(interval),
  });
});
