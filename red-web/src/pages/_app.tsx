import { ChakraProvider } from "@chakra-ui/react";

import { AppProps } from "next/app";
import theme from "../theme";

// const client = new Client({
//   url: "http://localhost:4000/graphql",
//   exchanges: [
//     cacheExchange({
//       updates: {
//         Mutation: {
//           logout: (_result, args, cache, info) => {
//             betterUpdateQuery<LogoutMutation, MeQuery>(
//               cache,
//               { query: MeDocument },
//               _result,
//               () => ({ me: null })
//             );
//           },

//           login: (_result: LoginMutation, args, cache, info) => {
//             // cache.updateQuery({query: MeDocument}, (data: MeQuery) => {});
//             betterUpdateQuery<LoginMutation, MeQuery>(
//               cache,
//               { query: MeDocument },
//               _result,
//               (result, query) => {
//                 if (result.login.errors) {
//                   return query;
//                 } else {
//                   return {
//                     me: result.login.user,
//                   };
//                 }
//               }
//             );
//           },

//           register: (_result: RegisterMutation, args, cache, info) => {
//             // cache.updateQuery({query: MeDocument}, (data: MeQuery) => {});
//             betterUpdateQuery<RegisterMutation, MeQuery>(
//               cache,
//               { query: MeDocument },
//               _result,
//               (result, query) => {
//                 if (result.register.errors) {
//                   return query;
//                 } else {
//                   return {
//                     me: result.register.user,
//                   };
//                 }
//               }
//             );
//           },
//         },
//       },
//     }),
//     fetchExchange,
//   ],
//   fetchOptions: {
//     credentials: "include",
//   },
// });

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ChakraProvider theme={theme} toastOptions={{ defaultOptions: { position: 'bottom' } }}>
        <Component {...pageProps} />
      </ChakraProvider>
  );
}

export default MyApp;
