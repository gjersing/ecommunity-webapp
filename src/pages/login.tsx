import React from "react";
import { Form, Formik } from "formik";
import { Button, Box } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../graphql/generated/graphql";
import { errorArrayToMap } from "../utils/errorArrayToMap";
import { useRouter } from "next/router";
import { NavBar } from "../components/NavBar";
import { Container } from "../components/Container";

interface loginProps {}

export const Register: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Container height="100vh">
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, actions) => {
            const response = await login({ options: values });
            if (response.data?.login.errors) {
              const errorMap = errorArrayToMap(response.data.login.errors);
              actions.setErrors(errorMap);
            } else if (response.data?.login.user) {
              router.push("/");
            }
          }}
        >
          {(props) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button
                mt={4}
                colorScheme="green"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Container>
  );
};

export default Register;
