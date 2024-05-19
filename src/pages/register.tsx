import React from "react";
import { Form, Formik } from "formik";
import {
  Button,
  Box,
  Heading,
  Link,
  Text,
  Flex,
  Card,
  Divider,
  Center,
} from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import InputField from "../components/InputField";
import { useRegisterMutation } from "../graphql/generated/graphql";
import { errorArrayToMap } from "../utils/errorArrayToMap";
import { useRouter } from "next/router";
import { NavBar } from "../components/NavBar";
import { Container } from "../components/Container";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Container height="100vh">
      <NavBar />
      <Wrapper>
        <Formik
          initialValues={{ email: "", username: "", password: "" }}
          onSubmit={async (values, actions) => {
            const response = await register({ variables: { options: values } });
            if (response.data?.register.errors) {
              const errorMap = errorArrayToMap(response.data.register.errors);
              actions.setErrors(errorMap);
            } else if (response.data?.register.user) {
              router.push("/");
            }
          }}
        >
          {(props) => (
            <Card
              p={[4, null, null, 8]}
              boxShadow="rgba(0, 0, 0, 0.12) 0px 2px 8px 0px, rgba(0, 0, 0, 0.16) 0px 0px 2px 0px"
            >
              <Form>
                <Center>
                  <Heading>Sign up</Heading>
                </Center>
                <Flex my={2} justifyContent="center">
                  <Text fontSize={"0.75rem"} color="gray">
                    ALREADY HAVE AN ACCOUNT?
                    <Link
                      href="/login"
                      as={NextLink}
                      color="blue"
                      fontSize={"0.75rem"}
                      ml={2}
                    >
                      LOG IN
                    </Link>
                  </Text>
                </Flex>
                <Divider my={2} />
                <InputField
                  name="username"
                  placeholder="username"
                  label="Username"
                />
                <Box mt={4}>
                  <InputField name="email" placeholder="email" label="Email" />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="password"
                    placeholder="password"
                    label="Password"
                    type="password"
                  />
                </Box>
                <Button
                  mt={6}
                  colorScheme="green"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Register
                </Button>
              </Form>
            </Card>
          )}
        </Formik>
      </Wrapper>
    </Container>
  );
};

export default withApollo({ ssr: false })(Register);
