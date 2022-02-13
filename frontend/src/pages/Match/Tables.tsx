/*
 * Copyright 2022 Puggies Authors (see AUTHORS.txt)
 *
 * This file is part of Puggies.
 *
 * Puggies is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * Puggies is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public
 * License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Puggies. If not, see <https://www.gnu.org/licenses/>.
 */

import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
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

// prettier-ignore
export const utilTableSchema: TableSchema = [
  { key: "smokesThrown", title: "Smokes", label: "Smokes thrown" },
  { key: "molliesThrown", title: "Molotovs", label: "Molotovs thrown" },
  { key: "HEsThrown", title: "HE", label: "HE grenades thrown" },
  { key: "flashesThrown", title: "Flashes", label: "Flashes thrown" },
  { key: "flashAssists", title: "FA", label: "Flash Assists" },
  { key: "utilDamage", title: "UD", label: "Utility Damage" },
  { key: "enemiesFlashed", title: "Enemies Blinded" },
  { key: "teammatesFlashed", title: "Teammates Blinded" },
  { key: "efPerFlash", title: "Enemies Blind per Flash" },
];

// prettier-ignore
export const openingsTableSchema: TableSchema = [
  { key: "tradeKills", title: "TrK", label: "Trade kills" },
  { key: "deathsTraded", title: "TrD", label: "Deaths traded" },
  { key: "openingKills", title: "FK", label: "First Kills" },
  { key: "openingDeaths", title: "FD", label: "First Deaths" },
  { key: "openingAttempts", title: "Opening Attempts" },
  { key: "openingAttemptsPct", title: "Opening Involvement", label: "% of rounds where the player was involved in an opening duel", pct: true },
  { key: "openingSuccess", title: "Success Rate", label: "% of opening duels resulting in a kill", pct: true },
];

// prettier-ignore
export const scoreTableSchema: TableSchema = [
  { key: "kills", title: "K", label: "Kills" },
  { key: "assists", title: "A", label: "Assists" },
  { key: "deaths", title: "D", label: "Deaths" },
  { key: "kd", title: "K/D", label: "Kill/death ratio" },
  { key: "kdiff", title: "K-D", label: "Kill-death difference" },
  { key: "kpr", title: "K/R", label: "Kills per round" },
  { key: "adr", title: "ADR", label: "Average damage per round" },
  { key: "headshotPct", title: "HS %", label: "Headshot kill percentage", pct: true },
  { key: "2k", title: "2K", label: "Rounds with 2 kills" },
  { key: "3k", title: "3K", label: "Rounds with 3 kills" },
  { key: "4k", title: "4K", label: "Rounds with 4 kills" },
  { key: "5k", title: "5K", label: "Rounds with 5 kills" },
  { key: "hltv", title: "HLTV 2.0", label: "Approximate HLTV 2.0 rating" },
  { key: "impact", title: "Impact", label: "Approximate HLTV Impact rating" },
  { key: "kast", title: "KAST", label: "% of rounds with kill/assist/survived/traded", pct: true },
  { key: "rws", title: "RWS", label: "Approximate average ESEA round win share" },
];

export const StatTable = (props: {
  data: Match;
  playerIds: string[];
  schema: TableSchema;
  sort: { key: keyof Stats; reversed: boolean };
  colClicked?: (key: string) => void;
  styles?: BoxProps;
}) => {
  return (
    <Box {...props.styles}>
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
          {props.playerIds.map((player) => (
            <Tr key={player}>
              <Td
                w={["40vw", null, "200px"]}
                maxW={["40vw", null, "200px"]}
                key={`${player}name`}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {props.data.meta.playerNames[player]}
              </Td>
              {props.schema.map((col) => {
                return (
                  <Td key={`${player}${col.key}`}>
                    {props.data.matchData.stats[col.key][player] ?? 0}
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
