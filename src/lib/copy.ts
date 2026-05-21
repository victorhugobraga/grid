export type Lang = "pt" | "en";

export type Copy = {
  morning: string;
  afternoon: string;
  evening: string;
  seeAll: string;
  nextRace: string;
  today: string;
  live: string;
  lap: string;
  standings: string;
  drivers: string;
  upcoming: string;
  lastResult: string;
  f1Section: string;
  footballSection: string;
  todayMatches: string;
  bigGame: string;
  pos: string;
  pts: string;
  j: string;
  sg: string;
  team: string;
  driver: string;
  backToHome: string;
  circuit: string;
  date: string;
  round: string;
  noData: string;
};

const COPY: Record<Lang, Copy> = {
  pt: {
    morning: "Bom dia",
    afternoon: "Boa tarde",
    evening: "Boa noite",
    seeAll: "Ver tudo",
    nextRace: "Próxima corrida",
    today: "Hoje",
    live: "Ao vivo",
    lap: "Volta",
    standings: "Classificação",
    drivers: "Pilotos",
    upcoming: "Próximas corridas",
    lastResult: "Último resultado",
    f1Section: "F1",
    footballSection: "Futebol",
    todayMatches: "Jogos de hoje",
    bigGame: "Jogo importante",
    pos: "Pos",
    pts: "Pts",
    j: "J",
    sg: "SG",
    team: "Equipe",
    driver: "Piloto",
    backToHome: "Voltar à página inicial",
    circuit: "Circuito",
    date: "Data",
    round: "Round",
    noData: "Sem dados",
  },
  en: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    seeAll: "See all",
    nextRace: "Next race",
    today: "Today",
    live: "Live",
    lap: "Lap",
    standings: "Standings",
    drivers: "Drivers",
    upcoming: "Upcoming races",
    lastResult: "Last result",
    f1Section: "F1",
    footballSection: "Football",
    todayMatches: "Today's matches",
    bigGame: "Big game",
    pos: "Pos",
    pts: "Pts",
    j: "P",
    sg: "GD",
    team: "Team",
    driver: "Driver",
    backToHome: "Back to home",
    circuit: "Circuit",
    date: "Date",
    round: "Round",
    noData: "No data",
  },
};

export function getCopy(lang: Lang): Copy {
  return COPY[lang];
}
