import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../graphql/generated/graphql";
import { VStack } from "@chakra-ui/react";
import { PostCard } from "../components/PostCard";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });
  return (
    <>
      <Container height="100%">
        <NavBar />
        <VStack mt={12} spacing={8} maxW={["80vw", "null", "70vw", "800px"]}>
          {!data ? (
            <div key="spinner">Loading...</div>
          ) : (
            data.posts.map((p) => <PostCard post={p} />)
          )}
        </VStack>
      </Container>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
