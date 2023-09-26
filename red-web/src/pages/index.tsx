import React from "react";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import { useRouter } from "next/router";
const Index = () => {
  const [{ data }] = usePostsQuery();
  const route = useRouter();

  const goToCreatePostPage = () => {
    route.push("/post/create-post");
  };
  return (
    <>
      <NavBar />
      {data?.posts ? (
        data?.posts.map((p) => <li key={p.id}>{p.title}</li>)
      ) : (
        <div>Hello WOrd</div>
      )}
      <button onClick={goToCreatePostPage}>Create Post</button>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

// import {
//   Link as ChakraLink,
//   Text,
//   Code,
//   List,
//   ListIcon,
//   ListItem,
// } from '@chakra-ui/react'
// import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'

// import { Hero } from '../components/Hero'
// import { Container } from '../components/Container'
// import { Main } from '../components/Main'
// import { DarkModeSwitch } from '../components/DarkModeSwitch'
// import { CTA } from '../components/CTA'
// import { Footer } from '../components/Footer'

// const Index = () => (
//   <Container height="100vh">
//     <Hero />
//     <Main>
//       <Text color="text">
//         Example repository of <Code>Next.js</Code> + <Code>chakra-ui</Code> +{' '}
//         <Code>TypeScript</Code>.
//       </Text>

//       <List spacing={3} my={0} color="text">
//         <ListItem>
//           <ListIcon as={CheckCircleIcon} color="green.500" />
//           <ChakraLink
//             isExternal
//             href="https://chakra-ui.com"
//             flexGrow={1}
//             mr={2}
//           >
//             Chakra UI <LinkIcon />
//           </ChakraLink>
//         </ListItem>
//         <ListItem>
//           <ListIcon as={CheckCircleIcon} color="green.500" />
//           <ChakraLink isExternal href="https://nextjs.org" flexGrow={1} mr={2}>
//             Next.js <LinkIcon />
//           </ChakraLink>
//         </ListItem>
//       </List>
//     </Main>

//     <DarkModeSwitch />
//     <Footer>
//       <Text>Next ❤️ Chakra</Text>
//     </Footer>
//     <CTA />
//   </Container>
// )

// export default Index
