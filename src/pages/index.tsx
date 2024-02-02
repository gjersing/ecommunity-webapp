import { Text } from "@chakra-ui/react";
import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";

const Index = () => (
  <Container height="100vh">
    <NavBar />
    <Text color="text">Hello world!</Text>
  </Container>
);

export default Index;
