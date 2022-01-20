import {
  Container,
  Divider,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import * as React from "react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { data } from "../data";
import { Match } from "../types";

const MatchCard = (props: { match: Match }) => {
  const {
    id,
    map,
    dateString,
    teamARounds,
    teamBRounds,
    teamATitle,
    teamBTitle,
  } = props.match.meta;
  return (
    <Link as={ReactRouterLink} to={`/match/${id}`}>
      <Flex
        p={5}
        my={5}
        borderRadius={10}
        style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
      >
        <Image src={`/${map}.jpg`} maxW="150px" mr={5} />
        <VStack align="start">
          <Heading as="h3" fontSize="2xl">
            {map} - {dateString}
          </Heading>
          <Flex alignItems="center" justifyContent="center">
            <Heading as="h4" fontSize="xl" fontWeight="normal" mr={2}>
              {teamATitle}
            </Heading>
            <Heading as="h4" fontSize="xl" fontWeight="normal" mr={2}>
              -
            </Heading>
            <Heading as="h4" fontSize="2xl">
              {teamARounds}:{teamBRounds}
            </Heading>
            <Heading as="h4" fontSize="xl" fontWeight="normal" ml={2}>
              -
            </Heading>
            <Heading as="h4" fontSize="xl" fontWeight="normal" ml={2}>
              {teamBTitle}
            </Heading>
          </Flex>
        </VStack>
        <Text></Text>
      </Flex>
    </Link>
  );
};

export const Home = () => (
  <Container maxW="container.xl" mt={16}>
    <Flex alignItems="center" justifyContent="space-between">
      <Heading lineHeight="unset" mb={0}>
        CSGO Pug Stats
      </Heading>
      <ColorModeSwitcher mx={2} justifySelf="flex-end" />
    </Flex>
    <Divider my={5} />
    <Heading as="h2" fontSize="3xl">
      Matches
    </Heading>
    {data.map((m) => (
      <MatchCard key={m.meta.id} match={m} />
    ))}
  </Container>
);
