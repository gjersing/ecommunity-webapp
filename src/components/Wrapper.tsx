import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
  children: React.ReactNode;
  variant?: "small" | "regular";
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      mt={8}
      maxWidth={variant === "regular" ? "80vw" : "50vw"}
      width="100%"
      mx="auto"
      justifyContent={"center"}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
