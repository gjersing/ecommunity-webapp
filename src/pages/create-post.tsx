import { Button, Card, Flex, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { NavBar } from "../components/NavBar";
import TextAreaField from "../components/TextAreaField";
import Wrapper from "../components/Wrapper";
import { useCreatePostMutation } from "../graphql/generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { errorArrayToMap } from "../utils/errorArrayToMap";
import { withApollo } from "../utils/withApollo";

const CreatePost: React.FC = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();

  return (
    <div className="createPost-container">
      <NavBar />
      <Wrapper>
        <Formik
          initialValues={{ body: "" }}
          onSubmit={async (values, actions) => {
            const response = await createPost({
              variables: { input: values },
              update: (cache) => {
                cache.evict({ fieldName: "posts" });
              },
            });
            if (response.data?.createPost.errors) {
              const errorMap = errorArrayToMap(
                response.data?.createPost.errors
              );
              actions.setErrors(errorMap);
            }
            if (!response.data?.createPost.errors) {
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
                <Heading mb={4} size="lg">
                  Create A Post
                </Heading>
                <TextAreaField
                  name="body"
                  placeholder="What on 🌎 is going on?"
                  label=""
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
            </Card>
          )}
        </Formik>
      </Wrapper>
    </div>
  );
};

export default withApollo({ ssr: false })(CreatePost);
