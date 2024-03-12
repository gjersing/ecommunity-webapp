import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import Wrapper from "../components/Wrapper";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import { useResetPasswordMutation } from "../graphql/generated/graphql";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, resetPassword] = useResetPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await resetPassword(values);
          setComplete(true);
        }}
      >
        {(props) =>
          complete ? (
            <Box>
              Thank you! If an account with that email exists, a link to reset
              the password will be sent.
            </Box>
          ) : (
            <Form>
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
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ForgotPassword);
