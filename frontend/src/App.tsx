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

import {
  Box,
  Button,
  ChakraProvider,
  extendTheme,
  Flex,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  ThemeConfig,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link as ReactRouterLink, Route, Routes } from "react-router-dom";
import shallow from "zustand/shallow";
import Fonts from "./components/Fonts";
import { Loading } from "./components/Loading";
import { Admin } from "./pages/Admin";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { MatchPage } from "./pages/Match";
import { NotFound } from "./pages/NotFound";
import { Register } from "./pages/Register";
import { useLoginStore } from "./stores/login";
import { useMatchesStore } from "./stores/matches";
import { useOptionsStore } from "./stores/options";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "Nimbus Sans",
    body: "Nimbus Sans",
  },
});

const Footer = () => {
  const showLove = useBreakpointValue([false, false, true]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        h="2.5rem"
        alignItems={["unset", "unset", "center"]}
        px={2.5}
        color="#777"
        flexDirection={["column", "column", "row"]}
      >
        <Text mr={4} fontWeight="bold">
          Puggies 1.0.0
        </Text>
        <Link href="/puggies-src.tar.gz" mr={4}>
          Source Code
        </Link>
        <Link isExternal href="https://github.com/jayden-chan/puggies" mr={4}>
          GitHub
        </Link>
        <Link href="/LICENSE.txt" mr={4}>
          License
        </Link>
        <Link onClick={onOpen}>Logo Attribution</Link>
        {showLove && <Text ml="auto">made with &#128153; in Canada</Text>}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Logo Attribution</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Pug icons created by Vitaly Gorbachev - Flaticon
          </ModalBody>

          <ModalFooter>
            <Button
              as={Link}
              isExternal
              href="https://www.flaticon.com/free-icons/pug"
              variant="ghost"
              mr={3}
            >
              flaticon.com
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Header = (props: { showLoginButton: boolean }) => {
  const [loggedIn, user, updateUser, logout] = useLoginStore(
    (state) => [state.loggedIn, state.user, state.updateUser, state.logout],
    shallow
  );

  const toast = useToast();

  useEffect(() => {
    updateUser();
  }, [updateUser]);

  return (
    <Flex
      bg="linear-gradient(180deg, rgba(20,24,33,1) 0%, rgba(20,24,33,0.0) 100%);"
      h="3rem"
      alignItems="center"
      px={4}
      fontWeight="bold"
    >
      <Link as={ReactRouterLink} to="/" mr={3}>
        <Image src="/favicon-32x32.png" />
      </Link>
      <Link as={ReactRouterLink} to="/">
        Home
      </Link>

      {loggedIn && user !== undefined ? (
        <Box ml="auto">
          <Menu>
            <MenuButton as={Link}>Hello, {user.displayName}!</MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  logout();
                  toast({
                    title: "Successfully logged out",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              >
                Sign out
              </MenuItem>
              {user.roles.includes("admin") && (
                <ReactRouterLink to="/admin">
                  <MenuItem>Administration</MenuItem>
                </ReactRouterLink>
              )}
            </MenuList>
          </Menu>
        </Box>
      ) : props.showLoginButton ? (
        <Link as={ReactRouterLink} to="/login" ml="auto">
          Login
        </Link>
      ) : (
        <></>
      )}
    </Flex>
  );
};

export const App = () => {
  const [showLoginButton, updateOptions] = useOptionsStore(
    (state) => [state.showLoginButton, state.updateOptions],
    shallow
  );
  const [matches, fetchMatches] = useMatchesStore(
    (state) => [state.matches, state.fetchMatches],
    shallow
  );

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    updateOptions();
  }, [updateOptions]);

  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <Header showLoginButton={showLoginButton} />
      {matches === undefined ? (
        <Loading minH="calc(100vh - 5.5rem)">Loading matches...</Loading>
      ) : (
        <Routes>
          <Route path="/" element={<Home matches={matches} />} />
          <Route path="/match/:id" element={<MatchPage matches={matches} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
      <Footer />
    </ChakraProvider>
  );
};
