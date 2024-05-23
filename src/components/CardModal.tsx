import React, { useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  Image,
} from "@chakra-ui/react";
import { PostData } from "../types";
import { gql } from "@apollo/client";
import router from "next/router";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import {
  Post,
  useCurrentUserQuery,
  useLikeMutation,
} from "../graphql/generated/graphql";
import moment from "moment";

interface CardModalProps {
  post: PostData;
  open: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CardModal: React.FC<CardModalProps> = ({
  post,
  open,
  setModalOpen,
}) => {
  const [like] = useLikeMutation();
  const { data: userData } = useCurrentUserQuery();
  const ref = useRef(null);

  const createdAtDate = moment(new Date(parseInt(post.createdAt))).calendar();

  return (
    <Modal
      size="xl"
      onClose={() => {
        setModalOpen(false);
      }}
      isOpen={open}
      allowPinchZoom
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent ref={ref}>
        <Flex
          flex="1"
          gap="4"
          alignItems="center"
          flexWrap="wrap"
          py={2}
          pl={2}
        >
          <Avatar name={post.author.username} />
          <Box>
            <Heading size="sm">{post.author.username}</Heading>
            <HStack>
              <Text display={"inline"} color="gray" suppressHydrationWarning>
                Posted {createdAtDate}
              </Text>
            </HStack>
          </Box>
        </Flex>
        <ModalCloseButton />
        <Text p={2}>{post.body}</Text>
        <Image
          src={post.img}
          alt={"Image for Post:" + post.id}
          onClick={() => {
            setModalOpen(false);
          }}
        />
        <Flex alignItems="center" p={2}>
          <Heading size="sm">Comments ({post.body.length})</Heading>
          <Button
            variant="ghost"
            leftIcon={
              post.likeStatus ? <IoHeart color="red" /> : <IoHeartOutline />
            }
            width="100px"
            ml="auto"
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
            <Text color={post.likeStatus ? "red" : "black"}>
              {post.points} Likes
            </Text>
          </Button>
        </Flex>
        <Divider mb={2} />
        <Text>{post.body}</Text>
      </ModalContent>
    </Modal>
  );
};
