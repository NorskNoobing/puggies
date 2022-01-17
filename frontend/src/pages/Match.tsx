import React from "react";
import { Box, Flex, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

type Data = {
  totalRounds: number;
  teams: { [key: string]: "CT" | "T" };
  kills: { [key: string]: number };
  assists: { [key: string]: number };
  deaths: { [key: string]: number };
  headshotPct: { [key: string]: number };
  kd: { [key: string]: number };
  kdiff: { [key: string]: number };
  kpr: { [key: string]: number };
  adr: { [key: string]: number };
  kast: { [key: string]: number };
  impact: { [key: string]: number };
  hltv: { [key: string]: number };
  flashAssists: { [key: string]: number };
  enemiesFlashed: { [key: string]: number };
  teammatesFlashed: { [key: string]: number };
  "2k": { [key: string]: number };
  "3k": { [key: string]: number };
  "4k": { [key: string]: number };
  "5k": { [key: string]: number };
};

const UtilTable = (props: { players: string[]; title: string }) => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>{props.title}</Th>
        <Th>Enemies Flashed</Th>
        <Th>Teammates Flashed</Th>
        <Th>Flash Ratio</Th>
        <Th>Flash Assists</Th>
      </Tr>
    </Thead>
    <Tbody>
      {props.players.map((player) => {
        const ef = data.enemiesFlashed[player] ?? 0;
        const tf = data.teammatesFlashed[player] ?? 0;
        return (
          <Tr>
            <Td>{player}</Td>
            <Td>{ef}</Td>
            <Td>{tf}</Td>
            <Td>{ef + tf === 0 ? 0 : Math.round((ef / (ef + tf)) * 100)}%</Td>
            <Td>{data.flashAssists[player] ?? 0}</Td>
          </Tr>
        );
      })}
    </Tbody>
  </Table>
);

const ScoreTable = (props: { players: string[]; title: string }) => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>{props.title}</Th>
        <Th>K</Th>
        <Th>A</Th>
        <Th>D</Th>
        <Th>K/D</Th>
        <Th>K-D</Th>
        <Th>ADR</Th>
        <Th>HS %</Th>
        <Th>2K</Th>
        <Th>3K</Th>
        <Th>4K</Th>
        <Th>5K</Th>
        <Th>HLTV 2.0</Th>
        <Th>Impact</Th>
        <Th>KAST</Th>
      </Tr>
    </Thead>
    <Tbody>
      {props.players.map((player) => {
        return (
          <Tr>
            <Td>{player}</Td>
            <Td>{data.kills[player] ?? 0}</Td>
            <Td>{data.assists[player] ?? 0}</Td>
            <Td>{data.deaths[player] ?? 0}</Td>
            <Td>{data.kd[player] ?? 0}</Td>
            <Td>{data.kdiff[player] ?? 0}</Td>
            <Td>{data.adr[player] ?? 0}</Td>
            <Td>{data.headshotPct[player] ?? 0}%</Td>
            <Td>{data["2k"][player] ?? 0}</Td>
            <Td>{data["3k"][player] ?? 0}</Td>
            <Td>{data["4k"][player] ?? 0}</Td>
            <Td>{data["5k"][player] ?? 0}</Td>
            <Td>{data.hltv[player] ?? 0}</Td>
            <Td>{data.impact[player] ?? 0}</Td>
            <Td>{data.kast[player] ?? 0}%</Td>
          </Tr>
        );
      })}
    </Tbody>
  </Table>
);

export const Match = () => (
  <Flex
    w="100%"
    h="100vh"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
  >
    <Tabs maxW="80%">
      <TabList>
        <Tab>Scoreboard</Tab>
        <Tab>Utility</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <ScoreTable
            title="Team A"
            players={Object.keys(data.teams)
              .filter((player) => data.teams[player] === "CT")
              .sort((a, b) => data.hltv[b] - data.hltv[a])}
          />

          <Box my={5} />

          <ScoreTable
            title="Team B"
            players={Object.keys(data.teams)
              .filter((player) => data.teams[player] === "T")
              .sort((a, b) => data.hltv[b] - data.hltv[a])}
          />
        </TabPanel>
        <TabPanel>
          <UtilTable
            title="Team A"
            players={Object.keys(data.teams)
              .filter((player) => data.teams[player] === "CT")
              .sort((a, b) => data.hltv[b] - data.hltv[a])}
          />

          <Box my={5} />

          <UtilTable
            title="Team B"
            players={Object.keys(data.teams)
              .filter((player) => data.teams[player] === "T")
              .sort((a, b) => data.hltv[b] - data.hltv[a])}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Flex>
);

const data: Data = {
  totalRounds: 20,
  teams: {
    BrianD: "T",
    MrGenericUser: "T",
    Nana4321: "T",
    Spacebro: "T",
    Wild_West: "CT",
    atomic: "CT",
    awesomaave: "CT",
    honestpretzels: "CT",
    jiaedin: "CT",
    nosidE: "T",
  },
  kills: {
    BrianD: 11,
    MrGenericUser: 6,
    Nana4321: 9,
    Spacebro: 14,
    Wild_West: 10,
    atomic: 35,
    awesomaave: 9,
    honestpretzels: 18,
    jiaedin: 18,
    nosidE: 19,
  },
  assists: {
    BrianD: 2,
    MrGenericUser: 3,
    Nana4321: 2,
    Spacebro: 2,
    Wild_West: 1,
    atomic: 6,
    awesomaave: 3,
    honestpretzels: 6,
    jiaedin: 3,
    nosidE: 4,
  },
  deaths: {
    BrianD: 18,
    MrGenericUser: 19,
    Nana4321: 19,
    Spacebro: 19,
    Wild_West: 13,
    atomic: 10,
    awesomaave: 13,
    honestpretzels: 12,
    jiaedin: 13,
    nosidE: 15,
  },
  headshotPct: {
    BrianD: 18,
    MrGenericUser: 50,
    Nana4321: 33,
    Spacebro: 43,
    Wild_West: 20,
    atomic: 43,
    awesomaave: 44,
    honestpretzels: 33,
    jiaedin: 72,
    nosidE: 53,
  },
  kd: {
    BrianD: 0.61,
    MrGenericUser: 0.32,
    Nana4321: 0.47,
    Spacebro: 0.74,
    Wild_West: 0.77,
    atomic: 3.5,
    awesomaave: 0.69,
    honestpretzels: 1.5,
    jiaedin: 1.38,
    nosidE: 1.27,
  },
  kdiff: {
    BrianD: -7,
    MrGenericUser: -13,
    Nana4321: -10,
    Spacebro: -5,
    Wild_West: -3,
    atomic: 25,
    awesomaave: -4,
    honestpretzels: 6,
    jiaedin: 5,
    nosidE: 4,
  },
  kpr: {
    BrianD: 0.55,
    MrGenericUser: 0.3,
    Nana4321: 0.45,
    Spacebro: 0.7,
    Wild_West: 0.5,
    atomic: 1.75,
    awesomaave: 0.45,
    honestpretzels: 0.9,
    jiaedin: 0.9,
    nosidE: 0.95,
  },
  adr: {
    BrianD: 64,
    MrGenericUser: 51,
    Nana4321: 73,
    Spacebro: 66,
    Wild_West: 45,
    atomic: 164,
    awesomaave: 51,
    honestpretzels: 124,
    jiaedin: 91,
    nosidE: 94,
  },
  kast: {
    BrianD: 35,
    MrGenericUser: 40,
    Nana4321: 45,
    Spacebro: 60,
    Wild_West: 60,
    atomic: 100,
    awesomaave: 75,
    honestpretzels: 75,
    jiaedin: 65,
    nosidE: 80,
  },
  impact: {
    BrianD: 0.8,
    MrGenericUser: 0.29,
    Nana4321: 0.59,
    Spacebro: 1.12,
    Wild_West: 0.68,
    atomic: 3.44,
    awesomaave: 0.61,
    honestpretzels: 1.63,
    jiaedin: 1.57,
    nosidE: 1.7,
  },
  hltv: {
    BrianD: 0.53,
    MrGenericUser: 0.28,
    Nana4321: 0.52,
    Spacebro: 0.82,
    Wild_West: 0.74,
    atomic: 2.59,
    awesomaave: 0.83,
    honestpretzels: 1.49,
    jiaedin: 1.27,
    nosidE: 1.39,
  },
  flashAssists: {
    atomic: 1,
    jiaedin: 1,
    nosidE: 2,
  },
  enemiesFlashed: {
    MrGenericUser: 3,
    Spacebro: 3,
    Wild_West: 4,
    atomic: 10,
    honestpretzels: 39,
    jiaedin: 8,
    nosidE: 19,
  },
  teammatesFlashed: {
    MrGenericUser: 1,
    Nana4321: 2,
    Spacebro: 2,
    Wild_West: 7,
    atomic: 7,
    awesomaave: 2,
    honestpretzels: 10,
    jiaedin: 3,
    nosidE: 17,
  },
  "2k": {
    BrianD: 1,
    MrGenericUser: 1,
    Nana4321: 2,
    Spacebro: 4,
    Wild_West: 2,
    atomic: 4,
    awesomaave: 2,
    honestpretzels: 2,
    jiaedin: 5,
    nosidE: 3,
  },
  "3k": {
    BrianD: 2,
    atomic: 5,
    jiaedin: 1,
    nosidE: 1,
  },
  "4k": {
    atomic: 1,
    honestpretzels: 2,
  },
  "5k": {},
};
