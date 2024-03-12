import { Button, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import router from "next/router";
import React from "react";
import Wrapper from "../components/Wrapper";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { NavBar } from "../components/NavBar";
import TextAreaField from "../components/TextAreaField";
import { useCreatePostMutation } from "../graphql/generated/graphql";

const CreatePost: React.FC = ({}) => {
  const [, createPost] = useCreatePostMutation();

  return (
    <div className="createPost-container">
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ body: "" }}
          onSubmit={async (values) => {
            // TO DO: Validate user inputs against obscenity filter
            await createPost({ input: values });
            router.push("/");
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
