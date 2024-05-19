import { Alert, AlertTitle, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { errorArrayToMap } from "../../utils/errorArrayToMap";
import { useChangePasswordMutation } from "../../graphql/generated/graphql";
import { useState } from "react";
import NextLink from "next/link";

const ResetPassword: React.FC = ({}) => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper>
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, actions) => {
          setTokenError("");
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = errorArrayToMap(
              response.data.changePassword.errors
            );
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            actions.setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {(props) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="New Password"
              label="New Password"
              type="Password"
            />
            {tokenError ? (
              <Alert status="error" mt={2}>
                <AlertTitle>{tokenError}</AlertTitle>
                <Link
                  href="/forgot-password"
                  as={NextLink}
                  textDecoration={"underline"}
                  color="blue"
                >
                  Try Again?
                </Link>
              </Alert>
            ) : null}
            <Button
              mt={4}
              colorScheme="green"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default ResetPassword;
