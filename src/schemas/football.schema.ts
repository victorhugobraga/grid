import { z } from "zod";

export const SUPPORTED_LEAGUES = [
  "brasileirao",
  "libertadores",
  "champions",
  "worldcup",
] as const;

export const footballStandingsQuerySchema = z.object({
  league: z.enum(SUPPORTED_LEAGUES, {
    error: `Liga inválida. Use: ${SUPPORTED_LEAGUES.join(", ")}`,
  }),
});

export const footballScheduleQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
    .optional()
    .default(() => new Date().toISOString().split("T")[0]),
});

export type FootballStandingsQuery = z.infer<
  typeof footballStandingsQuerySchema
>;
export type FootballScheduleQuery = z.infer<typeof footballScheduleQuerySchema>;
