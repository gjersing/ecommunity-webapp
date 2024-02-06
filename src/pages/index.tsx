import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../graphql/generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Container height="100vh">
        <NavBar />
        {!data ? (
          <div key="spinner">Loading...</div>
        ) : (
          data.posts.map((p) => <div key={p.id}>{p.title}</div>)
        )}
      </Container>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
