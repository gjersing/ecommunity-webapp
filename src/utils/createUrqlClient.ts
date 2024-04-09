import { Resolver, cacheExchange } from "@urql/exchange-graphcache";
import { Exchange, fetchExchange, gql, stringifyVariables } from "urql";
import { pipe, tap } from "wonka";
import {
  CurrentUserDocument,
  CurrentUserQuery,
  LikeMutationVariables,
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

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;

    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore: hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (typeof window === "undefined") {
    cookie = ctx?.req?.headers?.cookie;
  }

  return {
    url: "http://localhost:4000/graphql",
    exchanges: [
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            like: (_res, args, cache, _info) => {
              const { postId } = args as LikeMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    likeStatus
                  }
                `,
                { id: postId } as any
              );
              if (data) {
                const newPoints = data.likeStatus
                  ? (data.points as number) - 1
                  : (data.points as number) + 1;
                const newStatus = data.likeStatus ? null : 1;
                cache.writeFragment(
                  gql`
                    fragment points on Post {
                      points
                      likeStatus
                    }
                  `,
                  { id: postId, points: newPoints, likeStatus: newStatus }
                );
              }
            },
            createPost: (_res, _args, cache, _info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "posts"
              );
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "posts", fi.arguments);
              });
            },
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
      headers: cookie ? { cookie } : undefined,
    },
  };
};
