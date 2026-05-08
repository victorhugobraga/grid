import { withHandler, ok } from "@/lib/api";
import { ratelimit, getIp } from "@/lib/rate-limit";
import { RateLimitError, AppError } from "@/lib/errors";
import { footballScheduleQuerySchema } from "@/schemas/football.schema";
import { FootballService } from "@/services/football.service";

const service = new FootballService();

export const GET = withHandler(async (req: Request) => {
  const ip = getIp(req);
  const { success } = await ratelimit.limit(ip);
  if (!success) throw new RateLimitError();

  const { searchParams } = new URL(req.url);
  const parsed = footballScheduleQuerySchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }

  const { data, cachedAt } = await service.getMatchesByDate(parsed.data.date);
  return ok(data, cachedAt);
});
