import React from "react";
import { Form, Formik } from "formik";
import {
  Button,
  Box,
  Link,
  Flex,
  Center,
  Heading,
  Text,
  Divider,
  Card,
} from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../graphql/generated/graphql";
import { errorArrayToMap } from "../utils/errorArrayToMap";
import { useRouter } from "next/router";
import { NavBar } from "../components/NavBar";
import { Container } from "../components/Container";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Container height="100vh">
      <NavBar />
      <Wrapper>
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, actions) => {
            const response = await login(values);
            if (response.data?.login.errors) {
              const errorMap = errorArrayToMap(response.data.login.errors);
              actions.setErrors(errorMap);
            } else if (response.data?.login.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                router.push("/");
              }
            }
          }}
        >
          {(props) => (
            <Card
              p={8}
              boxShadow="rgba(0, 0, 0, 0.12) 0px 2px 8px 0px, rgba(0, 0, 0, 0.16) 0px 0px 2px 0px"
            >
              <Form>
                <Center>
                  <Heading>Sign in</Heading>
                </Center>
                <Flex my={2} justifyContent="center">
                  <Text fontSize={"0.75rem"} color="gray">
                    DON'T HAVE AN ACCOUNT?
                  </Text>
                  <Link
                    href="/register"
                    as={NextLink}
                    color="blue"
                    fontSize={"0.75rem"}
                    ml={2}
                  >
                    SIGN UP
                  </Link>
                </Flex>
                <Divider my={2} />
                <InputField
                  name="usernameOrEmail"
                  placeholder="Email or username"
                  label="Email or username"
                />
                <Box mt={4}>
                  <InputField
                    name="password"
                    placeholder="password"
                    label="Password"
                    type="Password"
                  />
                  <Flex>
                    <Link
                      href="/forgot-password"
                      as={NextLink}
                      color="blue"
                      fontSize={"0.75rem"}
                      ml={"auto"}
                      mr={2}
                    >
                      Forgot password?
                    </Link>
                  </Flex>
                </Box>
                <Button
                  mt={2}
                  colorScheme="green"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Login
                </Button>
              </Form>
            </Card>
          )}
        </Formik>
      </Wrapper>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
