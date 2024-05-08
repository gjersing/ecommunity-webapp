import {
  Avatar,
  Box,
  Button,
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
import { GiPlantRoots } from "react-icons/gi";
import { FaPlusCircle } from "react-icons/fa";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ data, fetching }] = useCurrentUserQuery();
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
                onClick={async () => {
                  await logout({});
                  router.reload();
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
    <Box
      py={3}
      px={[2, 3, 4, 5]}
      w={"100%"}
      alignItems="center"
      position="sticky"
      zIndex={1}
      top={0}
      bgColor="white"
    >
      <Flex
        mx="auto"
        alignItems="center"
        width={["100%", null, null, null, "80%", "1400px"]}
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
        <Button
          rightIcon={<FaPlusCircle color="green " />}
          maxWidth="600px"
          position="absolute"
          left="50%"
          transform="translate(-50%, 0);"
          color="green"
          px={[8, 40, 40, 40, 60]}
          onClick={() => {
            router.push("/create-post");
          }}
        >
          <Show breakpoint="(min-width: 350px)">Add A Post</Show>
        </Button>
        <Box ml="auto" mr={2} color="limegreen">
          {navLinks}
        </Box>
      </Flex>
    </Box>
  );
};
