import { z } from "zod";

const currentYear = new Date().getFullYear();

export const f1ScheduleQuerySchema = z.object({
  season: z
    .string()
    .regex(/^\d{4}$/, "Season deve ter 4 dígitos")
    .refine(
      (val) => {
        const year = parseInt(val);
        return year >= 1950 && year <= currentYear + 1;
      },
      { message: "Season inválida" },
    )
    .default(String(currentYear)),
});

export const f1RaceDetailQuerySchema = z.object({
  season: z
    .string()
    .regex(/^\d{4}$/, "Season deve ter 4 dígitos")
    .default(String(currentYear)),
  round: z
    .string()
    .regex(/^\d+$/, "Round deve ser numérico")
    .refine(
      (val) => {
        const n = parseInt(val);
        return n >= 1 && n <= 24;
      },
      { message: "Round deve ser entre 1 e 24" },
    ),
});

export type F1ScheduleQuery = z.infer<typeof f1ScheduleQuerySchema>;
export type F1RaceDetailQuery = z.infer<typeof f1RaceDetailQuerySchema>;
