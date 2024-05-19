import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { PostsQuery, usePostsQuery } from "../graphql/generated/graphql";
import { VStack, Spinner } from "@chakra-ui/react";
import { PostCard } from "../components/PostCard";
import { useEffect } from "react";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 10,
      cursor: null,
    },
  });

  // TO DO: Remove for v1.0
  if (!loading && error) {
    return <div>Something went wrong. Error: {error.message}</div>;
  }

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 20 &&
        data?.posts.hasMore
      ) {
        fetchMore({
          variables: {
            limit: variables?.limit,
            cursor: data
              ? data.posts.posts[data.posts.posts.length - 1].createdAt
              : null,
          },
          updateQuery: (previousValue, { fetchMoreResult }): PostsQuery => {
            if (!fetchMoreResult) {
              return previousValue;
            }

            return {
              __typename: "Query",
              posts: {
                __typename: "PaginatedPosts",
                hasMore: fetchMoreResult.posts.hasMore,
                posts: [
                  ...previousValue.posts.posts,
                  ...fetchMoreResult.posts.posts,
                ],
              },
            };
          },
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
        {loading && data?.posts.hasMore ? <Spinner /> : null}
      </VStack>
    </Container>
  );
};

export default Index;
