import {
  footballStandingsQuerySchema,
  footballScheduleQuerySchema,
} from "@/schemas/football.schema";

describe("footballStandingsQuerySchema", () => {
  it("deve aceitar league válida", () => {
    const ligas = ["brasileirao", "copa-brasil", "champions", "worldcup"];
    ligas.forEach((league) => {
      const result = footballStandingsQuerySchema.safeParse({ league });
      expect(result.success).toBe(true);
    });
  });

  it("deve rejeitar league desconhecida", () => {
    const result = footballStandingsQuerySchema.safeParse({
      league: "premier-league",
    });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar quando league não é informada", () => {
    const result = footballStandingsQuerySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("footballScheduleQuerySchema", () => {
  it("deve aceitar date no formato YYYY-MM-DD", () => {
    const result = footballScheduleQuerySchema.safeParse({
      date: "2026-05-10",
    });
    expect(result.success).toBe(true);
  });

  it("deve usar data de hoje como default quando não informada", () => {
    const result = footballScheduleQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.data?.date).toBeDefined();
  });

  it("deve rejeitar date em formato inválido", () => {
    const result = footballScheduleQuerySchema.safeParse({
      date: "10/05/2026",
    });
    expect(result.success).toBe(false);
  });
});
