import { Box, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useCurrentUserQuery } from "../graphql/generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useCurrentUserQuery();

  let navLinks = null;
  if (!data?.current_user) {
    navLinks = (
      <>
        <Link href="/register" as={NextLink} mr={8} color="white">
          Register
        </Link>
        <Link href="/login" as={NextLink} mr={8} color="white">
          Login
        </Link>
      </>
    );
  } else {
    navLinks = (
      <>
        <Link href="/login" as={NextLink} mr={8} color="white">
          {data.current_user.username}
        </Link>
      </>
    );
  }

  return (
    <Flex bg="forestgreen" p={4} w={"100%"}>
      <Link href="/" as={NextLink} ml={8} color="white">
        ECOmmunity
      </Link>
      <Box ml={"auto"} color="white">
        {fetching ? "Loading..." : navLinks}
      </Box>
    </Flex>
  );
};
