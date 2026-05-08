import { withHandler, ok } from "@/lib/api";
import { ratelimit, getIp } from "@/lib/rate-limit";
import { RateLimitError, AppError } from "@/lib/errors";
import { footballStandingsQuerySchema } from "@/schemas/football.schema";
import { FootballService } from "@/services/football.service";

const service = new FootballService();

export const GET = withHandler(async (req: Request, ctx: unknown) => {
  const ip = getIp(req);
  const { success } = await ratelimit.limit(ip);
  if (!success) throw new RateLimitError();

  const params = await (ctx as { params: Promise<{ league: string }> }).params;
  const parsed = footballStandingsQuerySchema.safeParse({
    league: params.league,
  });

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }

  const { data, cachedAt } = await service.getStandings(parsed.data.league);
  return ok(data, cachedAt);
});
