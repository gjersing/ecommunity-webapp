import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from "../graphql/generated/graphql";
import { useIsClient } from "../utils/isClientContext";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const isClient = useIsClient();
  const [{ data, fetching }] = useCurrentUserQuery({ pause: !isClient });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let navLinks = null;
  if (fetching) {
    navLinks = "Loading...";
  } else if (!data?.current_user) {
    navLinks = (
      <>
        <Link href="/register" as={NextLink} mr={8} color="white">
          Register
        </Link>
        <Link href="/login" as={NextLink} color="white">
          Log In
        </Link>
      </>
    );
  } else {
    navLinks = (
      <>
        <Link
          href={`/${data.current_user.username}`}
          as={NextLink}
          mr={8}
          color="white"
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
          color="white"
        >
          Logout
        </Button>
      </>
    );
  }

  return (
    <Flex bg="darkgreen" p={4} w={"100%"} alignItems="center">
      <Link
        href="/"
        as={NextLink}
        ml={8}
        color="white"
        fontWeight="bold"
        fontSize="x-large"
      >
        ECOmmunity
      </Link>
      <Box ml={"auto"} mr={8} color="white">
        {navLinks}
      </Box>
    </Flex>
  );
};
