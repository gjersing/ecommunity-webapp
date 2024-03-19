import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../graphql/generated/graphql";
import { VStack, Spinner, Button, Flex } from "@chakra-ui/react";
import { PostCard } from "../components/PostCard";
import { useEffect, useState } from "react";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 20 &&
        data?.posts.hasMore
      ) {
        setVariables({
          limit: variables.limit,
          cursor: data
            ? data.posts.posts[data.posts.posts.length - 1].createdAt
            : null,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [variables, data]);

  return (
    <Container height="100%">
      <NavBar />
      <VStack
        mt={12}
        mb={8}
        spacing={8}
        maxW={["90vw", "null", "80vw", "600px"]}
      >
        {!data ? (
          <Spinner />
        ) : (
          data.posts.posts.map((p) => <PostCard post={p} key={p.id} />)
        )}
      </VStack>
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            mb={8}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Container>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
