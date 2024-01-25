import { Text } from "@chakra-ui/react";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";

const Index = () => (
  <Container height="100vh">
    <Text color="text">Hello world!</Text>
    <DarkModeSwitch />
  </Container>
);

export default Index;
