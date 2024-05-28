import React from "react";
import { useRouter } from "next/router";
import { useUserPostsQuery } from "../graphql/generated/graphql";
import { PostCard } from "../components/PostCard";
import { Heading, Spinner, VStack, Text, Box } from "@chakra-ui/react";
import { NavBar } from "../components/NavBar";
import { withApollo } from "../utils/withApollo";
import { Container } from "../components/Container";

const Profile = ({}) => {
  const router = useRouter();

  const username =
    typeof router.query.username === "string" ? router.query.username : "";

  const { data, error, loading } = useUserPostsQuery({
    skip: !username,
    variables: {
      username: username,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && error) {
    return <div>Something went wrong. Error: {error.message}</div>;
  }

  return (
    <>
      <NavBar />
      <Container>
        {loading ? (
          <Spinner />
        ) : data && data.userPosts.isReal && data.userPosts.posts.length ? (
          <Box>
            <Heading mt={12}>
              <Text as="span" color="green">
                ECO
              </Text>
              mmunity posts by{" "}
              <Text as="span" color="green">
                {username}
              </Text>
            </Heading>
            <VStack
              my={8}
              spacing={8}
              maxW={["100vw", "90vw", "80vw", "600px"]}
            >
              {data?.userPosts.posts.map((p) => (
                <PostCard post={p} key={p.id} />
              ))}
            </VStack>
          </Box>
        ) : data?.userPosts.isReal ? (
          <>
            <Heading mt={12}>Sorry!</Heading>
            <Heading mt={12}>
              <Text color="green" as="span">
                {username}{" "}
              </Text>
              has yet to upload any posts.
            </Heading>
          </>
        ) : (
          <>
            <Heading mt={12}>Sorry!</Heading>
            <Heading mt={12}>
              <Text color="green" as="span">
                {username}{" "}
              </Text>
              does not exist.
            </Heading>
          </>
        )}
      </Container>
    </>
  );
};

export default withApollo({ ssr: false })(Profile);
