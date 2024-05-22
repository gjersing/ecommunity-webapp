import {
  Box,
  Button,
  Card,
  Center,
  CloseButton,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { NavBar } from "../components/NavBar";
import TextAreaField from "../components/TextAreaField";
import { useCreatePostMutation } from "../graphql/generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { errorArrayToMap } from "../utils/errorArrayToMap";
import { withApollo } from "../utils/withApollo";
import Dropzone from "react-dropzone";
import { RiImageAddFill } from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa";

const CreatePost: React.FC = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  const [fileToUpload, setFileToUpload] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState("");
  const [invalidUpload, setInvalidUpload] = useState(false);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []);

  return (
    <div className="createPost-container">
      <NavBar />
      <Box
        mt={8}
        maxWidth={["100vw", "90vw", "70vw", "50vw", "35vw"]}
        width="100%"
        mx="auto"
        justifyContent={"center"}
      >
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
                <Flex direction={"column"} w={["100%", null, "90%"]} mx="auto">
                  <Flex alignItems="center" mb={4}>
                    <Heading size="lg">Post an Image</Heading>
                    {fileToUpload ? (
                      <CloseButton
                        ml="auto"
                        onClick={() => {
                          setFileToUpload(undefined);
                          URL.revokeObjectURL(preview);
                        }}
                      />
                    ) : null}
                  </Flex>
                  <Dropzone
                    maxFiles={1}
                    accept={{
                      "image/*": [".jpeg", ".jpg", ".png", ".heic", ".heif"],
                    }}
                    onDropAccepted={(acceptedFiles) => {
                      setInvalidUpload(false);
                      const file = acceptedFiles[0] as File;
                      setFileToUpload(file);
                      setPreview(URL.createObjectURL(file));
                    }}
                    onDropRejected={() => {
                      setInvalidUpload(true);
                      setFileToUpload(undefined);
                    }}
                  >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                      <section>
                        {fileToUpload ? (
                          <Center>
                            <Image src={preview} />
                          </Center>
                        ) : (
                          <Center
                            h={"300px"}
                            borderColor="dark"
                            borderStyle="dashed"
                            borderWidth="2px"
                            borderRadius="lg"
                            backdropBlur={10}
                            backgroundColor="lightgray"
                            p={5}
                            {...getRootProps()}
                          >
                            <input
                              accept="image/*"
                              type="file"
                              {...getInputProps()}
                            />
                            {isDragActive ? (
                              <Center>
                                <FaBoxOpen size="10rem" />
                              </Center>
                            ) : (
                              <Center>
                                <RiImageAddFill size="10rem" />
                              </Center>
                            )}
                          </Center>
                        )}
                      </section>
                    )}
                  </Dropzone>
                  <TextAreaField
                    name="body"
                    placeholder="Image Caption (optional)"
                    label=""
                  />
                  {invalidUpload ? (
                    <Text
                      size="sm"
                      color="red"
                      mt={1}
                      ml={3}
                      whiteSpace="pre-line"
                    >
                      The provided file is invalid. <br /> Posts can only be one
                      image (.jpeg, .png, .heic, .heif)
                    </Text>
                  ) : null}
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
      </Box>
    </div>
  );
};

export default withApollo({ ssr: false })(CreatePost);
