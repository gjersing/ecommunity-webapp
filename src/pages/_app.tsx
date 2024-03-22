import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { IsClientContextProvider } from "../utils/isClientContext";
import { IsMobileContextProvider } from "../utils/isMobileContext";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IsClientContextProvider>
      <IsMobileContextProvider>
        <ChakraProvider theme={theme}>
          <Head>
            <title>ECOmmunity</title>
            <meta name="description" content="Social media for nature lovers" />
            <link
              rel="icon"
              href="https://cdn-icons-png.flaticon.com/512/6041/6041531.png"
              type="image/x-icon"
            />
            <link
              rel="shortcut icon"
              href="https://cdn-icons-png.flaticon.com/512/6041/6041531.png"
              type="image/x-icon"
            />
          </Head>
          <Component {...pageProps} />
        </ChakraProvider>
      </IsMobileContextProvider>
    </IsClientContextProvider>
  );
}

export default MyApp;
