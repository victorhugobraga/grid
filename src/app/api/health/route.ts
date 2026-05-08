import { redis } from "@/lib/redis";
import { ok, err } from "@/lib/api";

export async function GET() {
  try {
    await redis.ping();
    return ok({
      status: "ok",
      redis: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return err(error);
  }
}
