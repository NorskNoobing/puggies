import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  FlexProps,
  Heading,
  Image,
  ImageProps,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRoundIcon } from ".";
import { msToRoundTime } from "../../data";
import {
  CT_BLUE,
  Kill,
  KILLFEED_COLORS_MAP,
  RED_KILLFEED,
  Round,
  RoundByRound,
  TeamsMap,
  TEAM_COLORS_MAP,
  T_YELLOW,
} from "../../types";

type KillFeedThing = {
  killer: string;
  victim: string;
  kill: Kill;
};

const playerColor = (player: string, teams: TeamsMap) => {
  if (teams[player] === undefined) return "white";
  return KILLFEED_COLORS_MAP[teams[player]];
};

const KillFeedIcon = (props: ImageProps) => (
  <Image
    {...props}
    src={`/img${props.src}`}
    h="20px"
    mr={props.mx === undefined ? 2 : undefined}
  />
);

const KillFeedPlayer = (
  props: TextProps & {
    player: string;
  }
) => (
  <Text {...props} as="span" mt="2px" fontWeight="bold">
    {props.player}
  </Text>
);

const EventBox = (props: FlexProps) => (
  <Flex
    {...props}
    bg="black"
    alignItems="center"
    borderRadius={8}
    borderWidth={3}
    h="2.4rem"
    px={2}
    py={1}
    mt={1}
  >
    {props.children}
  </Flex>
);

const KillFeedItem = (
  props: KillFeedThing & { round: number; teams: TeamsMap }
) => {
  return (
    <EventBox borderColor={RED_KILLFEED}>
      {props.kill.attackerBlind && <KillFeedIcon src="/killfeed/blind.png" />}
      <KillFeedPlayer
        player={props.killer}
        color={playerColor(props.killer, props.teams)}
      />

      {props.kill.assistedFlash === true && (
        <>
          <KillFeedPlayer mx={2} player={"+"} color="white" />
          <KillFeedIcon src="/killfeed/flashassist.png" />
          <KillFeedPlayer
            player={props.kill.assister}
            color={playerColor(props.kill.assister, props.teams)}
          />
        </>
      )}

      <KillFeedIcon src={`/weapons/${props.kill.weapon}.png`} mx={2} />
      {props.kill.noScope && <KillFeedIcon src="/killfeed/noscope.png" />}
      {props.kill.throughSmoke && <KillFeedIcon src="/killfeed/smoke.png" />}
      {props.kill.penetratedObjects > 0 && (
        <KillFeedIcon src="/killfeed/wallbang.png" />
      )}
      {props.kill.isHeadshot && <KillFeedIcon src="/killfeed/headshot.png" />}
      <KillFeedPlayer
        player={props.victim}
        color={playerColor(props.victim, props.teams)}
      />
    </EventBox>
  );
};

const RoundResultIcon = (props: { round: Round; visibility: boolean }) => {
  if (props.visibility === false) {
    return <Box w="1.9rem" h="1.9rem" visibility="hidden" />;
  }

  return (
    <Box
      bg={props.round.winner === "CT" ? CT_BLUE : T_YELLOW}
      borderRadius={5}
      w="1.9rem"
      h="1.9rem"
    >
      <Flex alignItems="center" justifyContent="center" h="100%">
        <FontAwesomeIcon icon={getRoundIcon(props.round)} color="black" />
      </Flex>
    </Box>
  );
};

export const RoundByRoundList = (props: {
  roundByRound: RoundByRound;
  teams: TeamsMap;
  rounds: Round[];
}) => {
  return (
    <Accordion allowMultiple>
      {props.roundByRound.map((r, i) => {
        const { teamAScore, teamBScore, teamASide, teamBSide, events } = r;

        return (
          <AccordionItem key={i}>
            <AccordionButton>
              <Flex w="100%" alignItems="center">
                <Heading
                  as="h3"
                  flex={1}
                  fontSize="1.25rem"
                  textAlign="left"
                  lineHeight="1.25rem"
                  height="1.25rem"
                >
                  Round {i + 1}
                </Heading>

                <Flex flex={1} justifyContent="center" alignItems="center">
                  <RoundResultIcon
                    round={props.rounds[i]}
                    visibility={props.rounds[i].winner === teamASide}
                  />
                  <Heading
                    as="h3"
                    fontSize="xl"
                    ml={3}
                    textColor={TEAM_COLORS_MAP[teamASide]}
                  >
                    {teamAScore}
                  </Heading>
                  <Heading as="h3" fontSize="xl" mx={2}>
                    :
                  </Heading>
                  <Heading
                    as="h3"
                    fontSize="xl"
                    mr={3}
                    textColor={TEAM_COLORS_MAP[teamBSide]}
                  >
                    {teamBScore}
                  </Heading>
                  <RoundResultIcon
                    round={props.rounds[i]}
                    visibility={props.rounds[i].winner === teamBSide}
                  />
                </Flex>
                <Flex flex={1} justifyContent="center">
                  <AccordionIcon ml="auto" />
                </Flex>
              </Flex>
            </AccordionButton>

            <AccordionPanel>
              <Flex flexDirection="column" alignItems="start" mt={2}>
                {events.map((event, j) => {
                  const timeString = msToRoundTime(event.time);

                  return (
                    <Flex key={j}>
                      <Flex
                        h="2.4rem"
                        px={2}
                        py={1}
                        mt={1}
                        mr={1}
                        alignItems="center"
                      >
                        {timeString}
                      </Flex>
                      {event.kind === "kill" && (
                        <KillFeedItem
                          key={j}
                          {...event}
                          teams={props.teams}
                          round={i + 1}
                        />
                      )}

                      {event.kind === "plant" && (
                        <EventBox borderColor="gray">
                          {event.planter} planted the bomb
                        </EventBox>
                      )}

                      {event.kind === "defuse" && (
                        <EventBox borderColor="gray">
                          {event.defuser} defused the bomb
                        </EventBox>
                      )}

                      {event.kind === "bomb_explode" && (
                        <EventBox borderColor="gray">Bomb exploded</EventBox>
                      )}
                    </Flex>
                  );
                })}
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
