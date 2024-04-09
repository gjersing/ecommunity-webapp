import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../graphql/generated/graphql";
import { VStack, Spinner } from "@chakra-ui/react";
import { PostCard } from "../components/PostCard";
import { useEffect, useState } from "react";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
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
      <VStack my={8} spacing={8} maxW={["100vw", "90vw", "80vw", "600px"]}>
        {!data ? (
          <Spinner />
        ) : (
          data.posts.posts.map((p) =>
            !p ? null : <PostCard post={p} key={p.id} />
          )
        )}
        {fetching && data?.posts.hasMore ? <Spinner /> : null}
      </VStack>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
