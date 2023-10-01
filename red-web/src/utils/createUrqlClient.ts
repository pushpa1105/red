import { Resolver, cacheExchange } from "@urql/exchange-graphcache";
import { fetchExchange, Exchange, stringifyVariables } from "urql";
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
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
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

export const cursorPagination = (): Resolver => {
  // const compareArgs = (
  //   fieldArgs: Variables,
  //   connectionArgs: Variables
  // ): boolean => {
  //   for (const key in connectionArgs) {
  //     if (key === offsetArgument || key === limitArgument) {
  //       continue;
  //     } else if (!(key in fieldArgs)) {
  //       return false;
  //     }

  //     const argA = fieldArgs[key];
  //     const argB = connectionArgs[key];

  //     if (
  //       typeof argA !== typeof argB || typeof argA !== 'object'
  //         ? argA !== argB
  //         : stringifyVariables(argA) !== stringifyVariables(argB)
  //     ) {
  //       return false;
  //     }
  //   }

  //   for (const key in fieldArgs) {
  //     if (key === offsetArgument || key === limitArgument) {
  //       continue;
  //     }
  //     if (!(key in connectionArgs)) return false;
  //   }

  //   return true;
  // };

  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const hasInCache = cache.resolve(entityKey, fieldKey);
    info.partial = !hasInCache;
    const results: string[] = [];

    fieldInfos.forEach((field) => {
      const data = cache.resolve(entityKey, field.fieldKey) as string[];
      results.push(...data);
    });

    return results;

    // const visited = new Set();
    // let result: NullArray<string> = [];
    // let prevOffset: number | null = null;

    // for (let i = 0; i < size; i++) {
    //   const { fieldKey, arguments: args } = fieldInfos[i];
    //   if (args === null || !compareArgs(fieldArgs, args)) {
    //     continue;
    //   }

    //   const links = cache.resolve(entityKey, fieldKey) as string[];
    //   const currentOffset = args[offsetArgument];

    //   if (
    //     links === null ||
    //     links.length === 0 ||
    //     typeof currentOffset !== 'number'
    //   ) {
    //     continue;
    //   }

    //   const tempResult: NullArray<string> = [];

    //   for (let j = 0; j < links.length; j++) {
    //     const link = links[j];
    //     if (visited.has(link)) continue;
    //     tempResult.push(link);
    //     visited.add(link);
    //   }

    //   if (
    //     (!prevOffset || currentOffset > prevOffset) ===
    //     (mergeMode === 'after')
    //   ) {
    //     result = [...result, ...tempResult];
    //   } else {
    //     result = [...tempResult, ...result];
    //   }

    //   prevOffset = currentOffset;
    // }

    // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    // if (hasCurrentPage) {
    //   return result;
    // } else if (!(info as any).store.schema) {
    //   return undefined;
    // } else {
    //   info.partial = true;
    //   return result;
    // }
  };
};
