import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Image,
  Show,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import moment from "moment";
import NextLink from "next/link";
import React, { useState } from "react";
import { BiChat, BiShare } from "react-icons/bi";
import { FaHeart } from "react-icons/fa6";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { PiGlobeSimpleThin } from "react-icons/pi";
import { Post, useLikeMutation } from "../graphql/generated/graphql";
import { PostActions } from "./PostActions";
import gql from "graphql-tag";

interface PostData {
  id: number;
  author: {
    id: number;
    username: string;
    email: string;
  };
  body: string;
  points: number;
  likeStatus?: number | null | undefined;
  createdAt: string;
}

interface PostCardProps {
  post: PostData;
}

const cardActionSx = {
  minWidth: "60px",
  flex: "1",
};

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const createdAtDate = moment(new Date(parseInt(post.createdAt)));
  const hoursSincePosting = moment().diff(createdAtDate, "hours");

  const postDate =
    hoursSincePosting > 24 * 5
      ? createdAtDate.format("D MMM")
      : createdAtDate.fromNow();

  const [like] = useLikeMutation();

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
      bgColor="#FEFEFE"
    >
      <CardHeader p={[2, 3, 4, 5]} py={[2, 3, 4, 4]}>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={post.author.username} />
            <Box>
              <Heading size="sm">{post.author.username}</Heading>
              <HStack>
                <Text display={"inline"} color="gray" suppressHydrationWarning>
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
          <PostActions
            body={post.body}
            postId={post.id}
            authorId={post.author.id}
          />
        </Flex>
      </CardHeader>
      {cardBody}
      <NextLink href="/post[id]" as={`/post/${post.id}`}>
        <Image
          objectFit="cover"
          width="800px"
          maxHeight={["350px", "425px", "500px", "580px"]}
          objectPosition="center"
          src="https://us1-photo.nextdoor.com/post_photos/4b/ed/4bed03ee10cb58fd2b3d11e684302d87.jpeg?request_version=v2&output_type=jpeg&sizing=linear"
          alt={post.id + " Image"}
        />
      </NextLink>
      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        px={[2, 3, 4, 5]}
        py={2}
      >
        <Flex alignItems={"center"} gap={2} ml={2}>
          <FaHeart color="red" />
          <Heading size="sm" color={post.likeStatus ? "red" : "black"}>
            {post.points}
          </Heading>
        </Flex>
        <Flex gap={[1, 2, null, 3]}>
          <Button
            variant="ghost"
            leftIcon={
              post.likeStatus ? <IoHeart color="red" /> : <IoHeartOutline />
            }
            sx={cardActionSx}
            onClick={() => {
              like({
                variables: { postId: post.id },
                update: (cache) => {
                  const data = cache.readFragment<Post>({
                    id: "Post:" + post.id,
                    fragment: gql`
                      fragment _ on Post {
                        id
                        points
                        likeStatus
                      }
                    `,
                  });
                  if (data) {
                    const newPoints = data.likeStatus
                      ? (data.points as number) - 1
                      : (data.points as number) + 1;
                    const newStatus = data.likeStatus ? null : 1;
                    cache.writeFragment({
                      id: "Post:" + post.id,
                      fragment: gql`
                        fragment points on Post {
                          points
                          likeStatus
                        }
                      `,
                      data: { points: newPoints, likeStatus: newStatus },
                    });
                  }
                },
              });
            }}
          >
            <Show breakpoint="(min-width: 290px)">
              <Text color={post.likeStatus ? "red" : "black"}>Like</Text>
            </Show>
          </Button>
          <Button variant="ghost" leftIcon={<BiChat />} sx={cardActionSx}>
            <Show breakpoint="(min-width: 844px)">Comment</Show>
          </Button>
          <Button variant="ghost" leftIcon={<BiShare />} sx={cardActionSx}>
            <Show breakpoint="(min-width: 844px)">Share</Show>
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};
