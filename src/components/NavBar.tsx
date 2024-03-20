import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Show,
  Text,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from "../graphql/generated/graphql";
import { useIsClient } from "../utils/isClientContext";
import { GiPlantRoots } from "react-icons/gi";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const isClient = useIsClient();
  const router = useRouter();
  const [{ data, fetching }] = useCurrentUserQuery({ pause: !isClient });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let navLinks = null;
  if (fetching) {
    navLinks = null;
  } else if (!data?.current_user) {
    navLinks = (
      <Flex>
        <Link href="/login" as={NextLink} color="limegreen">
          <Avatar size="md" />
        </Link>
      </Flex>
    );
  } else {
    navLinks = (
      <Flex>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Avatar name={data.current_user.username} size="md" />}
            isRound
          ></MenuButton>
          <MenuList>
            <MenuGroup title={`Hi, ${data.current_user.username}!`}>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  router.push(`/${data.current_user?.username}`);
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  router.push("/create-post");
                }}
              >
                Add A Post
              </MenuItem>
              <MenuItem
                disabled={logoutFetching}
                onClick={() => {
                  logout({});
                }}
              >
                Logout
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Flex>
    );
  }

  return (
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
          <IconButton
            isRound={true}
            variant="solid"
            colorScheme="green"
            aria-label="Done"
            size="lg"
            fontSize="36px"
            icon={<GiPlantRoots />}
          />
          <Show breakpoint="(min-width: 1000px)">
            <Text>ECOmmunity</Text>
          </Show>
        </HStack>
      </Link>
      <Box ml={"auto"} mr={2} color="limegreen">
        {navLinks}
      </Box>
    </Flex>
  );
};
