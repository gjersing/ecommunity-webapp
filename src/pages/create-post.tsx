import { Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { NavBar } from "../components/NavBar";
import TextAreaField from "../components/TextAreaField";
import Wrapper from "../components/Wrapper";
import { useCreatePostMutation } from "../graphql/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();

  return (
    <div className="createPost-container">
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ body: "" }}
          onSubmit={async (values) => {
            // TO DO: Validate user inputs against obscenity filter
            const { error } = await createPost({ input: values });
            if (!error) {
              router.push("/");
            }
          }}
        >
          {(props) => (
            <Form>
              <TextAreaField
                name="body"
                placeholder="What's on your mind?"
                label="Post"
              />
              <Flex>
                <Button
                  mt={4}
                  ml="auto"
                  colorScheme="green"
                  isLoading={props.isSubmitting}
                  type="submit"
                  width={28}
                >
                  Share Post
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(CreatePost);
