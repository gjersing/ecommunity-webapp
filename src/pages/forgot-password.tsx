import React, { useState } from "react";
import Wrapper from "../components/Wrapper";
import { Box, Button, Heading } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import { useResetPasswordMutation } from "../graphql/generated/graphql";
import { NavBar } from "../components/NavBar";
import { withApollo } from "../utils/withApollo";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [resetPassword] = useResetPasswordMutation();
  return (
    <>
      <NavBar />
      <Wrapper>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            await resetPassword({ variables: values });
            setComplete(true);
          }}
        >
          {(props) =>
            props.isSubmitting || complete ? (
              <Box>
                <Heading size="md" mb={4}>
                  Forgot Password
                </Heading>
                Thank you! If an account with that email exists, a link to reset
                the password will be sent.
              </Box>
            ) : (
              <Form>
                <Heading size="md" mb={4}>
                  Forgot Password
                </Heading>
                <InputField
                  name="email"
                  placeholder="Email"
                  label="Email"
                  type="email"
                />
                <Button
                  mt={4}
                  colorScheme="green"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Reset Password
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
