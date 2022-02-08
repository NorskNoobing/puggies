import { format, parse } from "date-fns";
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

export const getDateInfo = (id: string): [string, number] => {
  const [regex, date] = id.match(/(\d\d\d\d-\d\d-\d\d)/) ?? demoDates[id] ?? [];
  if (!regex) {
    return ["Jan 1 1970", 0];
  }

  const dateParsed = parse(date, "yyyy-MM-dd", new Date());
  const dateString = format(dateParsed, "EEE MMM dd yyyy");
  return [dateString, dateParsed.valueOf()];
};

export const demoLinks: { [key: string]: string } = {
  "pug_de_overpass_2022-01-25_05":
    "https://drive.google.com/file/d/1cu06v4aGRCNfuiizK2b_G2ywUm4eHKSD/view?usp=sharing",
  "pug_de_nuke_2022-01-25_04":
    "https://drive.google.com/file/d/1AWmtqa4eCBBMrb4f2eaAoyy_rGMLT94z/view?usp=sharing",
  "pug_de_mirage_2022-01-15_06":
    "https://drive.google.com/file/d/12pxs1BvM5z20XPdznlTbG54EAqMhYfNo/view?usp=sharing",
  "pug_de_nuke_2022-01-15_05":
    "https://drive.google.com/file/d/1nwOuFzF42yhw4FXLNxpa2V3_hNFsZvrP/view?usp=sharing",
  "pug_de_nuke_2022-01-30_06":
    "https://drive.google.com/file/d/1PqBiW9QvktRzM310o4tq3Zwj5CIlme33/view?usp=sharing",
  "pug_de_vertigo_2022-02-02_06":
    "https://drive.google.com/file/d/1-bnV4eVgPpzH42avrbRsY92FlyJLMGRz/view?usp=sharing",
};

export const demoDates: { [key: string]: string[] } = {
  esea_match_16841568: ["_", "2022-01-31"],
  esea_match_16841554: ["_", "2022-02-02"],
  esea_match_16846368: ["_", "2022-02-07"],
};
