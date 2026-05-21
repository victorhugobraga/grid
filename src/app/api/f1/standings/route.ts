import { withHandler, okWithCache } from "@/lib/api";
import { TTL } from "@/lib/cache";
import { ratelimit, getIp } from "@/lib/rate-limit";
import { RateLimitError } from "@/lib/errors";
import { F1Service } from "@/services/f1.service";

const service = new F1Service();

export const GET = withHandler(async (req: Request) => {
  const ip = getIp(req);
  const { success } = await ratelimit.limit(ip);
  if (!success) throw new RateLimitError();

  const season = String(new Date().getFullYear());
  const { data, cachedAt } = await service.getDriverStandings(season);
  return okWithCache(data, TTL.STANDINGS, cachedAt);
});
