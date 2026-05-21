import { withHandler, ok } from "@/lib/api";
import { ratelimit, getIp } from "@/lib/rate-limit";
import { RateLimitError } from "@/lib/errors";
import { FootballService } from "@/services/football.service";
import { getLiveState } from "@/lib/live-state";
import { TTL } from "@/lib/cache";

const service = new FootballService();

export const GET = withHandler(async (req: Request) => {
  const ip = getIp(req);
  const { success } = await ratelimit.limit(ip);
  if (!success) throw new RateLimitError();

  const state = await getLiveState();

  if (state === "idle") {
    return Response.json(
      { success: true, data: [], state },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${TTL.STANDINGS}, stale-while-revalidate=${TTL.STANDINGS * 2}`,
        },
      },
    );
  }

  const { data, cachedAt } = await service.getLiveMatches();
  return ok(data, cachedAt);
});
