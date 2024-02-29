import {
  Button,
  Card,
  CardBody,
  Image,
  CardHeader,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  IconButton,
  CardFooter,
  Divider,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { BiLike, BiShare, BiChat } from "react-icons/bi";
import { PiGlobeSimpleThin } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Post } from "../graphql/generated/graphql";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    // <Card mt={3}>
    //   <CardBody mx={8} my={2}>
    //     {post.title}
    //   </CardBody>
    // </Card>
    <Card>
      <CardHeader>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />

            <Box>
              <Heading size="sm">Post Author</Heading>
              <HStack>
                <Text display={"inline"}>Location • Time Since Posted •</Text>
                <Tooltip label="This post is visible to anyone on ECOmmunity">
                  <span>
                    <PiGlobeSimpleThin />
                  </span>
                </Tooltip>
              </HStack>
            </Box>
          </Flex>
          <IconButton
            variant="ghost"
            colorScheme="gray"
            aria-label="See menu"
            icon={<BsThreeDotsVertical />}
          />
        </Flex>
      </CardHeader>
      <Divider color="lightgray" mx="auto" w="95%" />
      <CardBody>
        <Text>{post.title}</Text>
      </CardBody>
      <Image
        objectFit="cover"
        width="800px"
        maxHeight="580px"
        objectPosition="center"
        src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=2250&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Chakra UI"
      />
      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <Button flex="1" variant="ghost" leftIcon={<BiLike />}>
          Like
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
          Comment
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};
