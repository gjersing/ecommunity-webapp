import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <Box
      mt={8}
      maxWidth={["100vw", "90vw", null, "70vw", "50vw"]}
      width="100%"
      mx="auto"
      justifyContent={"center"}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
