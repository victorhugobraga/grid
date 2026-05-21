export const F1_TEAM_COLORS: Record<string, string> = {
  "Red Bull": "#1E40AF",
  McLaren: "#E8002D",
  Ferrari: "#B91C1C",
  Mercedes: "#0E7490",
  Williams: "#1D4ED8",
  "Aston Martin": "#065F46",
  RB: "#3730A3",
  Alpine: "#0EA5E9",
  Haas: "#DC2626",
  "Kick Sauber": "#16A34A",
  Sauber: "#16A34A",
  "Racing Bulls": "#3730A3",
};

export type FootballTeamInfo = { accent: string; short: string };

export const FOOTBALL_TEAM_INFO: Record<string, FootballTeamInfo> = {
  Flamengo: { accent: "#DC2626", short: "FLA" },
  Palmeiras: { accent: "#16A34A", short: "PAL" },
  Botafogo: { accent: "#111827", short: "BOT" },
  Bahia: { accent: "#1D4ED8", short: "BAH" },
  "Atlético-MG": { accent: "#111827", short: "ATL" },
  "Atlético Mineiro": { accent: "#111827", short: "ATL" },
  Internacional: { accent: "#DC2626", short: "INT" },
  "São Paulo": { accent: "#DC2626", short: "SAO" },
  Fluminense: { accent: "#7F1D1D", short: "FLU" },
  Corinthians: { accent: "#111827", short: "COR" },
  Grêmio: { accent: "#1D4ED8", short: "GRE" },
  Cruzeiro: { accent: "#1E40AF", short: "CRU" },
  Vasco: { accent: "#111827", short: "VAS" },
  Fortaleza: { accent: "#DC2626", short: "FOR" },
  "Athletico-PR": { accent: "#DC2626", short: "CAP" },
  Bragantino: { accent: "#DC2626", short: "RBB" },
  Juventude: { accent: "#16A34A", short: "JUV" },
  Ceará: { accent: "#111827", short: "CEA" },
  "Sport Recife": { accent: "#DC2626", short: "SPT" },
  Santos: { accent: "#111827", short: "SAN" },
  "River Plate": { accent: "#DC2626", short: "RIV" },
  "Real Madrid": { accent: "#F3F4F6", short: "RMA" },
  "Manchester City": { accent: "#7DD3FC", short: "MCI" },
};

export function getF1Color(constructor: string): string {
  return F1_TEAM_COLORS[constructor] ?? "#888888";
}

export function getFootballInfo(teamName: string): FootballTeamInfo {
  return (
    FOOTBALL_TEAM_INFO[teamName] ?? {
      accent: "#888888",
      short: teamName.slice(0, 3).toUpperCase(),
    }
  );
}
