import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../graphql/generated/graphql";
import { Box } from "@chakra-ui/react";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Container height="100vh">
        <NavBar />
        <Box mt={6}>
          {!data ? (
            <div key="spinner">Loading...</div>
          ) : (
            data.posts.map((p) => (
              <Box key={p.id} mt={2}>
                {p.title}
              </Box>
            ))
          )}
        </Box>
      </Container>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
