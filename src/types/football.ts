export type League = "brasileirao" | "copa-brasil" | "champions" | "worldcup";

export type FootballTeam = {
  id: number;
  name: string;
  logo?: string;
  country?: string;
};

export type FootballMatch = {
  id: number;
  date: string;
  status: {
    short: "NS" | "LIVE" | "HT" | "FT" | "PST" | "CANC";
    elapsed?: number;
  };
  league: {
    id: number;
    name: string;
    round: string;
  };
  home: FootballTeam & { goals: number | null };
  away: FootballTeam & { goals: number | null };
};

export type FootballStanding = {
  rank: number;
  team: FootballTeam;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDiff: number;
  form?: string;
};
