import React from "react";
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
  Show,
  IconButton,
} from "@chakra-ui/react";
import { PostData } from "../types";
import { gql } from "@apollo/client";
import router from "next/router";
import { IoClose, IoHeart, IoHeartOutline } from "react-icons/io5";
import {
  Comment,
  Post,
  useCommentMutation,
  useCurrentUserQuery,
  useLikeMutation,
} from "../graphql/generated/graphql";
import moment from "moment";
import { BiShare, BiChat } from "react-icons/bi";
import { Form, Formik } from "formik";
import { errorArrayToMap } from "../utils/errorArrayToMap";
import TextAreaField from "../components/TextAreaField";
import { FaArrowRight } from "react-icons/fa6";
import { CommentActions } from "./CommentActions";

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
  const [comment] = useCommentMutation();
  const [like] = useLikeMutation();
  const { data: userData } = useCurrentUserQuery();

  const createdAtDate = moment(new Date(parseInt(post.createdAt))).calendar();
  const commentsLength = post.comments?.length || 0;

  return (
    <Modal
      onClose={() => {
        setModalOpen(false);
      }}
      isOpen={open}
      allowPinchZoom
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent maxWidth="800px" pt={4} pb={4}>
        <Flex
          flex="1"
          gap="4"
          alignItems="center"
          flexWrap="wrap"
          pb={2}
          pl={4}
        >
          <IconButton
            aria-label="visit author profile"
            icon={<Avatar name={post.author.username} />}
            isRound
          />
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
            zIndex={999}
          />
        </Show>
        <Show breakpoint="(min-width:1000px)">
          <ModalCloseButton />
        </Show>
        <Text p={2}>{post.body}</Text>
        <Image src={post.img} alt={"Image for Post:" + post.id} />
        <Flex alignItems="center" px={2} pt={2}>
          <Show breakpoint="(min-width: 400px)">
            <Heading size="sm" pl={4}>
              Comments ({commentsLength})
            </Heading>
          </Show>
          <Show breakpoint="(max-width: 400px)">
            <Heading size="sm">
              <Flex alignItems="center" gap={1}>
                <BiChat /> ({commentsLength})
              </Flex>
            </Heading>
          </Show>
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
          <Button variant="ghost" leftIcon={<BiShare />} minW="60px">
            <Show breakpoint="(min-width: 844px)">Share</Show>
          </Button>
        </Flex>
        <Formik
          initialValues={{ body: "" }}
          onSubmit={async (values, actions) => {
            const response = await comment({
              variables: { postId: post.id, body: values.body },
              update: (cache, { data }) => {
                const comment = data?.comment.comment;
                const postFrag = cache.readFragment<Post>({
                  id: "Post:" + post.id,
                  fragment: gql`
                    fragment _ on Post {
                      comments {
                        id
                        body
                        username
                        userId
                      }
                    }
                  `,
                });
                if (postFrag && comment) {
                  const newComment: Comment = {
                    ...comment,
                    post: postFrag,
                    postId: postFrag.id,
                  };
                  let comments: Comment[] = postFrag?.comments || [];
                  const newComments = comments.concat(newComment);
                  cache.writeFragment({
                    id: "Post:" + post.id,
                    fragment: gql`
                      fragment _ on Post {
                        comments {
                          id
                          body
                          username
                          userId
                        }
                      }
                    `,
                    data: { comments: newComments },
                  });
                }
              },
            });
            if (response.data?.comment.errors) {
              const errorMap = errorArrayToMap(response.data?.comment.errors);
              actions.setErrors(errorMap);
            } else {
              actions.resetForm();
            }
          }}
        >
          {(props) => (
            <Form>
              <Flex px={3} pb={3}>
                <TextAreaField
                  name="body"
                  placeholder="Add a comment..."
                  label=""
                  username={userData?.current_user?.username}
                />
                <IconButton
                  mt={2}
                  ml={1}
                  aria-label="add comment"
                  icon={<FaArrowRight />}
                  colorScheme="green"
                  isLoading={props.isSubmitting}
                  isDisabled={!props.dirty}
                  type="submit"
                />
              </Flex>
            </Form>
          )}
        </Formik>
        {post.comments
          ? [...post.comments].reverse().map((comment) =>
              !comment ? null : (
                <Box key={comment.id}>
                  <Divider my={2} />
                  <Box px={2} pb={2}>
                    <Flex alignItems="center">
                      <IconButton
                        aria-label="visit author profile"
                        icon={
                          <Avatar name={comment.username || "?"} size="sm" />
                        }
                        isRound
                      />
                      <Heading size="sm" ml={1}>
                        {comment.username || "?"}
                      </Heading>
                      <Text ml={1} mt={0.4} fontSize="xs" color="gray">
                        •{" "}
                        {moment(new Date(parseInt(comment.createdAt))).format(
                          "l"
                        )}
                      </Text>
                      <CommentActions
                        body={comment.body}
                        postId={comment.id}
                        authorId={comment.userId}
                      />
                    </Flex>
                    <Text pl={10} fontSize="sm">
                      {comment.body}
                    </Text>
                  </Box>
                </Box>
              )
            )
          : null}
      </ModalContent>
    </Modal>
  );
};
