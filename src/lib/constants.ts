export const ESPN_SLUGS = {
  BRASILEIRAO: "bra.1",
  COPA_BRASIL: "bra.copa_do_brasil",
  CHAMPIONS: "uefa.champions",
  WORLD_CUP: "fifa.world",
} as const;

// Slugs consultados apenas para o card de próximos jogos do Flamengo
export const FLAMENGO_EXTRA_SLUGS = [
  "conmebol.libertadores",
  "conmebol.sudamericana",
] as const;

export const FAVORITE_DRIVERS = [
  "bortoleto",
  "antonelli",
  "max_verstappen",
] as const;

// ESPN team ID 819 (descoberto via bra.1/standings)
export const FAVORITE_TEAMS = [{ id: 819, name: "Flamengo" }] as const;

export const FAVORITE_CONSTRUCTORS = ["mclaren"] as const;
