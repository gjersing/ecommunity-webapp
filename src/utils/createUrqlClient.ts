import { cacheExchange } from "@urql/exchange-graphcache";
import { Exchange, fetchExchange } from "urql";
import { pipe, tap } from "wonka";
import {
  CurrentUserDocument,
  CurrentUserQuery,
  LoginMutation,
  LogoutMutation,
  RegisterMutation,
} from "../graphql/generated/graphql";
import { typedUpdateQuery } from "./typedUpdateQuery";
import Router from "next/router";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      })
    );
  };

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  exchanges: [
    cacheExchange({
      updates: {
        Mutation: {
          logout: (res, _args, cache, _info) => {
            typedUpdateQuery<LogoutMutation, CurrentUserQuery>(
              cache,
              {
                query: CurrentUserDocument,
              },
              res,
              () => ({ current_user: null })
            );
          },
          login: (res, _args, cache, _info) => {
            typedUpdateQuery<LoginMutation, CurrentUserQuery>(
              cache,
              {
                query: CurrentUserDocument,
              },
              res,
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
          register: (res, _args, cache, _info) => {
            typedUpdateQuery<RegisterMutation, CurrentUserQuery>(
              cache,
              {
                query: CurrentUserDocument,
              },
              res,
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
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include" as const,
  },
});
