export type F1Race = {
  season: string;
  round: string;
  raceName: string;
  circuit: {
    name: string;
    location: string;
    country: string;
  };
  date: string;
  time?: string;
  sessions?: {
    fp1?: string;
    fp2?: string;
    fp3?: string;
    qualifying?: string;
    sprint?: string;
  };
};

export type F1Driver = {
  driverId: string;
  code: string;
  number: string;
  givenName: string;
  familyName: string;
  nationality: string;
  constructor: string;
};

export type F1Standing = {
  position: string;
  points: string;
  wins: string;
  driver: F1Driver;
};

export type F1ConstructorStanding = {
  position: string;
  points: string;
  wins: string;
  name: string;
  nationality: string;
};

export type F1RaceResult = {
  round: string;
  raceName: string;
  date: string;
  circuit: string;
  results: Array<{
    position: string;
    driverCode: string;
    driverName: string;
    constructor: string;
    time?: string;
    status: string;
    points: string;
    fastestLap?: {
      rank: string;
      time: string;
    };
  }>;
};
