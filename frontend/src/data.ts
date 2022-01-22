import { format, parse } from "date-fns";
import { Match, RawData, Round, Team } from "./types";
import pug_de_mirage_2022_01_15 from "./matchData/pug_de_mirage_2022-01-15_06.json";
import pug_de_nuke_2022_01_15 from "./matchData/pug_de_nuke_2022-01-15_05.json";

export const getPlayers = (
  data: RawData,
  side: Team,
  sortCol: keyof RawData,
  reverse: boolean
): string[] =>
  Object.keys(data.teams)
    .filter((player) => data.teams[player] === side)
    .sort((a, b) => {
      // @ts-ignore
      const aa = data[sortCol][reverse ? a : b] ?? 0;
      // @ts-ignore
      const bb = data[sortCol][reverse ? b : a] ?? 0;
      return aa - bb;
    });

export const getScore = (
  rounds: Round[],
  team: Team,
  toRound: number
): number => {
  return (
    rounds
      .slice(0, toRound > 15 ? 15 : toRound)
      .filter((r) => r.winner !== team).length +
    rounds
      .slice(15, toRound <= 15 ? 15 : toRound)
      .filter((r) => r.winner === team).length
  );
};

const processData = (
  info: { demoLink: string; id: string },
  rawData: RawData
): Match => {
  const [regex, map, date] =
    info.id.match(/^pug_(.*?)_(\d\d\d\d-\d\d-\d\d)/) ?? [];
  if (!regex) {
    throw new Error("Failed to map data");
  }

  const dateString = format(
    parse(date, "yyyy-MM-dd", new Date()),
    "EEE MMM dd yyyy"
  );

  const teamARounds = getScore(rawData.rounds, "CT", 30);
  const teamBRounds = getScore(rawData.rounds, "T", 30);

  const teamATitle = `team_${getPlayers(rawData, "CT", "hltv", false)[0]}`;
  const teamBTitle = `team_${getPlayers(rawData, "T", "hltv", false)[0]}`;

  return {
    ...rawData,
    meta: {
      ...info,
      dateString,
      map,
      teamARounds,
      teamBRounds,
      teamATitle,
      teamBTitle,
    },
    name: Object.fromEntries(Object.keys(rawData.teams).map((p) => [p, p])),
    roundByRound: rawData.killFeed.map((k, i) => {
      const teamAScore = getScore(rawData.rounds, "CT", i + 1);
      const teamBScore = getScore(rawData.rounds, "T", i + 1);
      const kills = Object.entries(k)
        .map(([killer, kills]) =>
          Object.entries(kills).map(([victim, kill]) => ({
            killer,
            victim,
            kill,
          }))
        )
        .flat()
        .sort((a, b) => a.kill.timeMs - b.kill.timeMs);

      return { teamAScore, teamBScore, kills };
    }),
    efPerFlash: Object.fromEntries(
      Object.entries(rawData.flashesThrown).map(([player, flashes]) => {
        return [
          player,
          Math.round(((rawData.enemiesFlashed[player] ?? 0) / flashes) * 100) /
            100,
        ];
      })
    ),
  };
};

export const data = [
  {
    info: {
      demoLink:
        "https://drive.google.com/file/d/12pxs1BvM5z20XPdznlTbG54EAqMhYfNo/view?usp=sharing",
      id: "pug_de_mirage_2022-01-15_05",
    },
    // @ts-ignore
    rawData: pug_de_mirage_2022_01_15 as RawData,
  },
  {
    info: {
      demoLink:
        "https://drive.google.com/file/d/1nwOuFzF42yhw4FXLNxpa2V3_hNFsZvrP/view?usp=sharing",
      id: "pug_de_nuke_2022-01-15_05",
    },
    // @ts-ignore
    rawData: pug_de_nuke_2022_01_15 as RawData,
  },
].map((m) => processData(m.info, m.rawData));
