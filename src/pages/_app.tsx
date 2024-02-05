import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { Client, Provider, fetchExchange } from "urql";
import { Cache, QueryInput, cacheExchange } from "@urql/exchange-graphcache";
import {
  CurrentUserDocument,
  CurrentUserQuery,
  LoginMutation,
  RegisterMutation,
} from "../graphql/generated/graphql";

function typedUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = new Client({
  url: "http://localhost:4000/graphql",
  exchanges: [
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            typedUpdateQuery<LoginMutation, CurrentUserQuery>(
              cache,
              {
                query: CurrentUserDocument,
              },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    current_user: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            typedUpdateQuery<RegisterMutation, CurrentUserQuery>(
              cache,
              {
                query: CurrentUserDocument,
              },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    current_user: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
