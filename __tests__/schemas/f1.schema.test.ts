import {
  f1ScheduleQuerySchema,
  f1RaceDetailQuerySchema,
} from "@/schemas/f1.schema";

describe("f1ScheduleQuerySchema", () => {
  it("deve aceitar season válida como string numérica", () => {
    const result = f1ScheduleQuerySchema.safeParse({ season: "2026" });
    expect(result.success).toBe(true);
  });

  it("deve usar season atual como default quando não informada", () => {
    const result = f1ScheduleQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.data?.season).toBeDefined();
  });

  it("deve rejeitar season com menos de 4 dígitos", () => {
    const result = f1ScheduleQuerySchema.safeParse({ season: "26" });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar season no futuro distante (> ano atual + 1)", () => {
    const result = f1ScheduleQuerySchema.safeParse({ season: "2099" });
    expect(result.success).toBe(false);
  });
});

describe("f1RaceDetailQuerySchema", () => {
  it("deve aceitar round válido entre 1 e 24", () => {
    const result = f1RaceDetailQuerySchema.safeParse({
      season: "2026",
      round: "5",
    });
    expect(result.success).toBe(true);
  });

  it("deve rejeitar round 0", () => {
    const result = f1RaceDetailQuerySchema.safeParse({
      season: "2026",
      round: "0",
    });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar round maior que 24", () => {
    const result = f1RaceDetailQuerySchema.safeParse({
      season: "2026",
      round: "25",
    });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar round não numérico", () => {
    const result = f1RaceDetailQuerySchema.safeParse({
      season: "2026",
      round: "abc",
    });
    expect(result.success).toBe(false);
  });
});
