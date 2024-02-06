import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { IsClientContextProvider } from "../utils/isClientContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IsClientContextProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </IsClientContextProvider>
  );
}

export default MyApp;
