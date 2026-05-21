import { withHandler, okWithCache } from "@/lib/api";
import { TTL } from "@/lib/cache";
import { ratelimit, getIp } from "@/lib/rate-limit";
import { RateLimitError, AppError } from "@/lib/errors";
import { f1ScheduleQuerySchema } from "@/schemas/f1.schema";
import { F1Service } from "@/services/f1.service";

const service = new F1Service();

export const GET = withHandler(async (req: Request) => {
  const ip = getIp(req);
  const { success } = await ratelimit.limit(ip);
  if (!success) throw new RateLimitError();

  const { searchParams } = new URL(req.url);
  const parsed = f1ScheduleQuerySchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }

  const { data, cachedAt } = await service.getSchedule(parsed.data.season);
  return okWithCache(data, TTL.SCHEDULE, cachedAt);
});
