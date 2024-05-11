import { Button, Card, Flex, Heading, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import TextAreaField from "../components/TextAreaField";
import Wrapper from "../components/Wrapper";
import { useCreatePostMutation } from "../graphql/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const CreatePost: React.FC = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  const [validationError, setValidationError] = useState("");
  const profanityMatcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  return (
    <div className="createPost-container">
      <NavBar />
      <Wrapper>
        <Formik
          initialValues={{ body: "" }}
          onSubmit={async (values) => {
            setValidationError("");
            if (profanityMatcher.hasMatch(values.body)) {
              setValidationError(
                "The entered text contains profanity that prevents it from being submitted."
              );
            } else if (values.body.length > 280) {
              setValidationError(
                "The entered text is too long. The maximum post is 280 characters."
              );
            } else {
              const { error } = await createPost({ input: values });
              if (!error) {
                router.push("/");
              }
            }
          }}
        >
          {(props) => (
            <Card
              p={[4, null, null, 8]}
              boxShadow="rgba(0, 0, 0, 0.12) 0px 2px 8px 0px, rgba(0, 0, 0, 0.16) 0px 0px 2px 0px"
            >
              <Form>
                <Heading mb={4} size="lg">
                  Create A Post
                </Heading>
                <TextAreaField
                  name="body"
                  placeholder="What on 🌎 is going on?"
                  label=""
                />
                {validationError ? (
                  <Text fontSize="sm" color={"red"}>
                    {validationError}
                  </Text>
                ) : null}
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
            </Card>
          )}
        </Formik>
      </Wrapper>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(CreatePost);
