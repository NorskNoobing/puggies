import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { Match, Stats } from "../../types";

export type TableSchema = {
  key: keyof Stats;
  title: string;
  label?: string;
  pct?: boolean;
  clickable?: boolean;
}[];

export const utilTableSchema: TableSchema = [
  { key: "smokesThrown", title: "Smokes", label: "# of smokes thrown" },
  { key: "molliesThrown", title: "Molotovs", label: "# of molotovs thrown" },
  { key: "HEsThrown", title: "HE", label: "# of HE grenades thrown" },
  { key: "flashesThrown", title: "Flashes", label: "# of flashes thrown" },
  { key: "flashAssists", title: "FA", label: "Flash Assists" },
  { key: "utilDamage", title: "UD", label: "Utility Damage" },
  { key: "enemiesFlashed", title: "Enemies Blinded" },
  { key: "teammatesFlashed", title: "Teammates Blinded" },
  { key: "efPerFlash", title: "Enemies Blind per Flash" },
];

// prettier-ignore
export const scoreTableSchema: TableSchema = [
  { key: "kills", title: "K", label: "Kills" },
  { key: "assists", title: "A", label: "Assists" },
  { key: "deaths", title: "D", label: "Deaths" },
  { key: "timesTraded", title: "T", label: "# of times traded" },
  { key: "kd", title: "K/D", label: "Kill/death ratio" },
  { key: "kdiff", title: "K-D", label: "Kill-death difference" },
  { key: "kpr", title: "K/R", label: "Kills per round" },
  { key: "adr", title: "ADR", label: "Average damage per round" },
  { key: "headshotPct", title: "HS %", label: "Headshot kill percentage", pct: true },
  { key: "2k", title: "2K", label: "# of rounds with 2 kills" },
  { key: "3k", title: "3K", label: "# of rounds with 3 kills" },
  { key: "4k", title: "4K", label: "# of rounds with 4 kills" },
  { key: "5k", title: "5K", label: "# of rounds with 5 kills" },
  { key: "hltv", title: "HLTV 2.0", label: "Approximate HLTV 2.0 rating" },
  { key: "impact", title: "Impact", label: "Approximate HLTV Impact rating" },
  { key: "kast", title: "KAST", label: "% of rounds with kill/assist/survived/traded", pct: true },
  { key: "rws", title: "RWS", label: "Approximate average ESEA round win share" },
];

export const StatTable = (props: {
  data: Match;
  players: string[];
  schema: TableSchema;
  sort: { key: keyof Stats; reversed: boolean };
  colClicked?: (key: string) => void;
}) => {
  return (
    <Box overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Player</Th>
            {props.schema.map((col) => (
              <Th
                key={col.title}
                lineHeight="unset"
                style={{ cursor: col.clickable ?? true ? "pointer" : "unset" }}
                onClick={
                  props.colClicked !== undefined && (col.clickable ?? true)
                    ? () => props.colClicked!(col.key)
                    : undefined
                }
              >
                {col.label !== undefined ? (
                  <Tooltip label={col.label}>{col.title}</Tooltip>
                ) : (
                  col.title
                )}
                {props.sort.reversed ? (
                  <ChevronUpIcon
                    w={4}
                    h={4}
                    visibility={
                      col.key === props.sort.key ? "visible" : "hidden"
                    }
                  />
                ) : (
                  <ChevronDownIcon
                    w={4}
                    h={4}
                    visibility={
                      col.key === props.sort.key ? "visible" : "hidden"
                    }
                  />
                )}
              </Th>
            ))}
          </Tr>
        </Thead>

        <Tbody>
          {props.players.map((player) => (
            <Tr key={player}>
              <Td minW="150px" key={`${player}name`}>
                {player}
              </Td>
              {props.schema.map((col) => {
                return (
                  <Td key={`${player}${col.key}`}>
                    {props.data.stats[col.key][player] ?? 0}
                    {col.pct === true ? "%" : ""}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
