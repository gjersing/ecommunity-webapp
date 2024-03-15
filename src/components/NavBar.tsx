import { Box, Button, Flex, HStack, Link, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from "../graphql/generated/graphql";
import { Icon } from "@chakra-ui/react";
import { useIsClient } from "../utils/isClientContext";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { GiPlantRoots } from "react-icons/gi";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const isClient = useIsClient();
  const [{ data, fetching }] = useCurrentUserQuery({ pause: !isClient });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let navLinks = null;
  if (fetching) {
    navLinks = null;
  } else if (!data?.current_user) {
    navLinks = (
      <>
        <Link href="/register" as={NextLink} mr={8} color="limegreen">
          Register
        </Link>
        <Link href="/login" as={NextLink} color="limegreen">
          Log In
        </Link>
      </>
    );
  } else {
    navLinks = (
      <>
        <Link
          href={`/create-post`}
          as={NextLink}
          mr={8}
          color="limegreen"
          fontWeight="bold"
        >
          {data.current_user.username}
        </Link>
        <Button
          onClick={() => {
            logout({});
          }}
          isLoading={logoutFetching}
          variant="link"
          color="limegreen"
        >
          Logout
        </Button>
      </>
    );
  }

  return (
    // TO DO: Non-sticky NavBar for mobile
    <Flex
      py={3}
      px={5}
      w={"100%"}
      alignItems="center"
      position="sticky"
      zIndex={1}
      top={0}
    >
      <Link
        href="/"
        as={NextLink}
        ml={2}
        color="limegreen"
        fontWeight="bold"
        fontSize="x-large"
        _hover={{ textDecoration: "none" }}
      >
        <HStack>
          <Icon as={GiPlantRoots} ml={4} boxSize={8} color="limegreen" />
          <Text>ECOmmunity</Text>
        </HStack>
      </Link>
      <Box ml={"auto"} mr={8} color="limegreen">
        {navLinks}
      </Box>
      <Box mr={4} display="inline">
        <DarkModeSwitch />
      </Box>
    </Flex>
  );
};
