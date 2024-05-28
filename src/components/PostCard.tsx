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
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { BiChat } from "react-icons/bi";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { PiGlobeSimpleThin } from "react-icons/pi";
import {
  Post,
  useCurrentUserQuery,
  useLikeMutation,
} from "../graphql/generated/graphql";
import { PostActions } from "./PostActions";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { PostData } from "../types";
import { CardModal } from "./CardModal";

interface PostCardProps {
  post: PostData;
}

const cardActionSx = {
  flex: "1",
};

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const createdAtDate = moment(new Date(parseInt(post.createdAt)));
  const hoursSincePosting = moment().diff(createdAtDate, "hours");
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);

  const bodyLength =
    useBreakpointValue({ base: 100, sm: 130, md: 180 }, { fallback: "md" }) ||
    100;

  const postDate =
    hoursSincePosting > 24 * 5
      ? createdAtDate.format("D MMM")
      : createdAtDate.fromNow();

  const [like] = useLikeMutation();
  const { data: userData } = useCurrentUserQuery();

  return (
    <Card
      boxShadow="rgba(0, 0, 0, 0.12) 0px 2px 8px 0px, rgba(0, 0, 0, 0.16) 0px 0px 2px 0px"
      id={post.id.toString()}
      bgColor="#FEFEFE"
    >
      <CardHeader p={[2, 3, 4, 5]} py={[2, 3, 4, 4]}>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <IconButton
              aria-label="visit author profile"
              icon={<Avatar name={post.author.username} />}
              onClick={() => {
                router.push(`/${post.author.username}`);
              }}
              isRound
            />
            <Box>
              <Heading
                size="sm"
                onClick={() => {
                  router.push(`/${post.author.username}`);
                }}
                cursor="pointer"
              >
                {post.author.username}
              </Heading>
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
      <CardBody
        pt={0}
        pb={4}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <Text cursor="pointer">
          {post.body.length > bodyLength
            ? post.body.slice(0, bodyLength - 20) + " ..."
            : post.body}
        </Text>
      </CardBody>
      <Image
        objectFit="cover"
        width="800px"
        maxHeight={["350px", "425px", "500px", "580px"]}
        objectPosition="center"
        src={post.img}
        alt={"Image for Post:" + post.id}
        onClick={() => {
          setModalOpen(true);
        }}
        cursor="pointer"
      />
      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        px={[2, 3, 4, 5]}
        py={2}
      >
        <Flex gap={[1, 2, null, 3]}>
          <Button
            variant="ghost"
            leftIcon={<BiChat />}
            sx={cardActionSx}
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <Show breakpoint="(min-width: 844px)">Comment </Show>(
            {post.comments?.length || 0})
          </Button>
          {/* <Button variant="ghost" leftIcon={<BiShare />} sx={cardActionSx}>
            <Show breakpoint="(min-width: 844px)">Share</Show>
          </Button> */}
        </Flex>
        <Flex alignItems={"center"} gap={2}>
          <Button
            variant="ghost"
            leftIcon={
              post.likeStatus ? <IoHeart color="red" /> : <IoHeartOutline />
            }
            sx={cardActionSx}
            onClick={() => {
              if (userData?.current_user) {
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
              } else {
                router.push("/login");
              }
            }}
          >
            <Heading size="sm" color={post.likeStatus ? "red" : "black"}>
              {post.points}
            </Heading>
          </Button>
        </Flex>
      </CardFooter>
      <CardModal
        post={post}
        open={modalOpen}
        setModalOpen={setModalOpen}
        key={post.id + "Modal"}
      />
    </Card>
  );
};
