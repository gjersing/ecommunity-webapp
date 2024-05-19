import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { IsClientContextProvider } from "../utils/isClientContext";
import { IsMobileContextProvider } from "../utils/isMobileContext";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Head from "next/head";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  credentials: "include",
  // headers: cookie ? { cookie } : undefined,
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <IsClientContextProvider>
        <IsMobileContextProvider>
          <ChakraProvider theme={theme}>
            <Head>
              <title>ECOmmunity</title>
              <meta
                name="description"
                content="Social media for nature lovers"
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
    </ApolloProvider>
  );
}

export default MyApp;
