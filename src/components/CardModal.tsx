import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  // Divider,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  Image,
  Show,
  IconButton,
} from "@chakra-ui/react";
import { PostData } from "../types";
import { gql } from "@apollo/client";
import router from "next/router";
import { IoClose, IoHeart, IoHeartOutline } from "react-icons/io5";
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

  const [imageOpen, setImageOpen] = useState(false);
  const createdAtDate = moment(new Date(parseInt(post.createdAt))).calendar();

  return (
    <>
      <Modal
        onClose={() => {
          setModalOpen(false);
          setImageOpen(false);
        }}
        isOpen={open}
        allowPinchZoom
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent maxWidth="800px" pt={2}>
          <Flex
            flex="1"
            gap="4"
            alignItems="center"
            flexWrap="wrap"
            pb={2}
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
          <Show breakpoint="(max-width:1000px)">
            <IconButton
              aria-label="close post"
              icon={<IoClose size={28} />}
              position="fixed"
              isRound
              right={2}
              onClick={() => {
                setModalOpen(false);
              }}
            />
          </Show>
          <Show breakpoint="(min-width:1000px)">
            <ModalCloseButton />
          </Show>
          <Text p={2}>{post.body}</Text>
          <Image
            src={post.img}
            alt={"Image for Post:" + post.id}
            onClick={() => {
              setImageOpen(true);
            }}
          />
          <Flex alignItems="center" p={2}>
            {/* // TO DO: add comments length in parenthesis */}
            {/* <Heading size="sm">Comments</Heading> */}
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
          {/* <Divider mb={2} /> */}
          {/* // TO DO: iterate over comments and output */}
        </ModalContent>
      </Modal>
      {imageOpen ? (
        <Box
          background={`RGBA(0,0,0,.5) url(${post.img}) no-repeat center`}
          backgroundSize="contain"
          backdropFilter="blur(10px)"
          w="100%"
          h="100%"
          position="fixed"
          zIndex={10000}
          top={0}
          left={0}
          cursor="zoom-out"
          onClick={() => {
            setImageOpen(false);
          }}
        />
      ) : null}
    </>
  );
};
