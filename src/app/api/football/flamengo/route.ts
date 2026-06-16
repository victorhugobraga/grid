import { withHandler, okWithCache } from "@/lib/api";
import { TTL } from "@/lib/cache";
import { ratelimit, getIp } from "@/lib/rate-limit";
import { RateLimitError } from "@/lib/errors";
import { FootballService } from "@/services/football.service";

const service = new FootballService();

export const GET = withHandler(async (req: Request) => {
  const ip = getIp(req);
  const { success } = await ratelimit.limit(ip);
  if (!success) throw new RateLimitError();

  const { data, cachedAt } = await service.getFlamengoUpcoming();
  return okWithCache(data, TTL.FIXTURES, cachedAt);
});
