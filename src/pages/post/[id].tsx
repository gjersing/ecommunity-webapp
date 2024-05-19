import React from "react";
import { useRouter } from "next/router";
import { usePostQuery } from "../../graphql/generated/graphql";
import Wrapper from "../../components/Wrapper";
import { PostCard } from "../../components/PostCard";
import { Box, Heading, Text, Spinner, Center } from "@chakra-ui/react";
import { NavBar } from "../../components/NavBar";
import { withApollo } from "../../utils/withApollo";

const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const { data, error, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (loading) {
    return (
      <>
        <NavBar />
        <Center>
          <Spinner mt={12} />
        </Center>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Wrapper>
        {data?.post ? (
          <PostCard post={data.post} key={data.post.id} />
        ) : (
          <Center>
            <Box>
              <Heading>404: Post Not Found</Heading>
              <Text mt={4}>
                We're sorry, the post you're looking for could not be found.
              </Text>
              <Text color="red" mt={2}>
                {error?.message}
              </Text>
            </Box>
          </Center>
        )}
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: true })(Post);
