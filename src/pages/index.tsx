import { Text } from "@chakra-ui/react";
import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => (
  <Container height="100vh" bgColor="beige">
    <NavBar />
    <Text color="text">Hello world!</Text>
  </Container>
);

export default withUrqlClient(createUrqlClient)(Index);
