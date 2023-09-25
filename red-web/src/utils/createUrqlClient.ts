import { cacheExchange } from "@urql/exchange-graphcache";
import { fetchExchange, Exchange } from "urql";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import Router from "next/router";
// import { useToast } from "@chakra-ui/react";
// const toast = useToast();

export const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        // If the OperationResult has an error send a request to sentry
        if (error?.message.includes("No Authentication")) {
          alert("No Auth");
          Router.replace("/user/login");
          // toast({
          //   title: "No Authentication.",
          //   status: "error",
          //   duration: 9000,
          //   isClosable: true,
          // });
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
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },

          login: (_result: LoginMutation, args, cache, info) => {
            // cache.updateQuery({query: MeDocument}, (data: MeQuery) => {});
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },

          register: (_result: RegisterMutation, args, cache, info) => {
            // cache.updateQuery({query: MeDocument}, (data: MeQuery) => {});
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    errorExchange,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include" as const,
  },
});
