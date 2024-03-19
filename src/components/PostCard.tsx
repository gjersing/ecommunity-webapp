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
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiHeart, BiShare, BiChat } from "react-icons/bi";
import { PiGlobeSimpleThin } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import moment from "moment";

interface PostData {
  id: number;
  author: {
    id: number;
    username: string;
    email: string;
  };
  body: string;
  points: number;
  createdAt: string;
}

interface PostCardProps {
  post: PostData;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const createdAtDate = moment(new Date(parseInt(post.createdAt)));
  const hoursSincePosting = moment().diff(createdAtDate, "hours");

  const postDate =
    hoursSincePosting > 24 * 5
      ? createdAtDate.format("D MMM")
      : createdAtDate.fromNow();

  const [seeMore, setSeeMore] = useState(post.body.length > 150);
  const cardBody = (
    <CardBody pt={0} pb={4}>
      <Text height={!seeMore ? "auto" : 9}>
        {!seeMore ? post.body : post.body.slice(0, 120) + "..."}
      </Text>
      {seeMore ? (
        <Flex>
          <Text
            mt={-3}
            mr={4}
            ml="auto"
            color="gray"
            onClick={() => {
              setSeeMore(!seeMore);
            }}
          >
            See More
          </Text>
        </Flex>
      ) : null}
    </CardBody>
  );

  return (
    <Card
      boxShadow="rgba(0, 0, 0, 0.12) 0px 2px 8px 0px, rgba(0, 0, 0, 0.16) 0px 0px 2px 0px"
      id={post.id.toString()}
    >
      <CardHeader>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name="Post Author" src="https://bit.ly/sage-adebayo" />
            <Box>
              <Heading size="sm">{post.author.username}</Heading>
              <HStack>
                <Text display={"inline"} color="gray">
                  {postDate} •
                </Text>
                <Tooltip label="This post is visible to anyone on ECOmmunity">
                  <span>
                    <PiGlobeSimpleThin color="gray" />
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
      {cardBody}
      <Image
        objectFit="cover"
        width="800px"
        maxHeight="580px"
        objectPosition="center"
        src="https://images.unsplash.com/photo-1578507065211-1c4e99a5fd24?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt={post.id + " Image"}
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
        <Button flex="1" variant="ghost" leftIcon={<BiHeart />}>
          {post.points}
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
