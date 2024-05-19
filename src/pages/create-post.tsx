import { Box, Button, Card, Flex, Heading, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import TextAreaField from "../components/TextAreaField";
import Wrapper from "../components/Wrapper";
import { useCreatePostMutation } from "../graphql/generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { errorArrayToMap } from "../utils/errorArrayToMap";
import { withApollo } from "../utils/withApollo";
import Dropzone from "react-dropzone";

const CreatePost: React.FC = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  const [fileToUpload, setFileToUpload] = useState<File | undefined>(undefined);
  const [invalidUpload, setInvalidUpload] = useState(false);

  return (
    <div className="createPost-container">
      <NavBar />
      <Wrapper>
        <Formik
          initialValues={{ body: "" }}
          onSubmit={async (values, actions) => {
            const response = await createPost({
              variables: { input: values, file: fileToUpload },
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
                <Dropzone
                  maxFiles={1}
                  accept={{
                    "image/*": [".jpeg", ".jpg", ".png", ".heic", ".heif"],
                  }}
                  onDropAccepted={(acceptedFiles) => {
                    setInvalidUpload(false);
                    const file = acceptedFiles[0] as File;
                    setFileToUpload(file);
                    console.log(acceptedFiles);
                  }}
                  onDropRejected={() => {
                    setInvalidUpload(true);
                    setFileToUpload(undefined);
                    console.log("invalid");
                  }}
                >
                  {({ getRootProps, getInputProps, isDragActive }) => (
                    <section>
                      <Box
                        mt={4}
                        borderColor="dark"
                        borderStyle="dashed"
                        borderWidth="2px"
                        borderRadius="lg"
                        backdropBlur={10}
                        backgroundColor="lightgray"
                        p={5}
                        {...getRootProps()}
                      >
                        <input accept="image/png" {...getInputProps()} />
                        {isDragActive ? (
                          <Text>Drop the image here</Text>
                        ) : fileToUpload ? (
                          <Text>📷 ✅</Text>
                        ) : (
                          <Text>
                            Drag 'n' drop your image here, or just click to
                            select an image🍎
                          </Text>
                        )}
                      </Box>
                      {invalidUpload ? (
                        <Text size="sm" color="red">
                          The uploaded file is invalid.
                        </Text>
                      ) : null}
                    </section>
                  )}
                </Dropzone>
                <Flex>
                  <Button
                    mt={4}
                    ml="auto"
                    colorScheme="green"
                    isLoading={props.isSubmitting}
                    type="submit"
                    isDisabled={!fileToUpload}
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
