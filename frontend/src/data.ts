import { DemoType, Match, Stats, Team } from "./types";

export const getPlayers = (
  data: Match,
  side: Team,
  sortCol: keyof Stats,
  reverse: boolean
): string[] =>
  Object.keys(data.teams)
    .filter((player) => data.teams[player] === side)
    .sort((a, b) => {
      const aa = data.stats[sortCol][reverse ? a : b] ?? 0;
      const bb = data.stats[sortCol][reverse ? b : a] ?? 0;
      return aa - bb;
    });

export const msToRoundTime = (ms: number): string => {
  const seconds = Math.round(ms / 1000) % 60;
  const minutes = Math.floor(Math.round(ms / 1000) / 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const getDemoTypePretty = (demoType: DemoType): string => {
  switch (demoType) {
    case "esea":
      return "ESEA match";
    case "pugsetup":
      return "PUG";
    case "faceit":
      return "FACEIT match";
    case "steam":
      return "Match";
  }
};

export const getESEAId = (matchId: string): string | undefined => {
  const [, id] = matchId.match(/esea_match_(\d+)/) ?? [];
  return id;
};
