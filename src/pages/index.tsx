import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../graphql/generated/graphql";
import { VStack, Spinner } from "@chakra-ui/react";
import { PostCard } from "../components/PostCard";
import { withApollo } from "../utils/withApollo";
import InfiniteScroll from "react-infinite-scroll-component";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 3,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  // TO DO: Remove for v1.0
  if (!loading && error) {
    return <div>Something went wrong. Error: {error.message}</div>;
  }

  const fetchData = () => {
    fetchMore({
      variables: {
        limit: variables?.limit,
        cursor: data
          ? data.posts.posts[data.posts.posts.length - 1].createdAt
          : null,
      },
    });
  };

  return (
    <Container height="100%">
      <NavBar />
      <InfiniteScroll
        dataLength={data?.posts.posts.length || 0}
        next={fetchData}
        hasMore={data?.posts.hasMore || false}
        loader={<Spinner />}
        style={{ overflow: "visible" }}
      >
        <VStack my={8} spacing={8} maxW={["100vw", "90vw", "80vw", "600px"]}>
          {!data ? (
            <Spinner />
          ) : (
            data.posts.posts.map((p) =>
              !p ? null : <PostCard post={p} key={p.id} />
            )
          )}
        </VStack>
      </InfiniteScroll>
    </Container>
  );
};

export default withApollo({ ssr: false })(Index);
