import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { IsClientContextProvider } from "../utils/isClientContext";
import { IsMobileContextProvider } from "../utils/isMobileContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IsClientContextProvider>
      <IsMobileContextProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </IsMobileContextProvider>
    </IsClientContextProvider>
  );
}

export default MyApp;
