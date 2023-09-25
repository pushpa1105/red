import React from "react";
import PostCard from "../../components/Post/PostCard";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import Layout from "../../components/Layout";
import { usePostsQuery } from "../../generated/graphql";
import { Box } from "@chakra-ui/react";

const Post = () => {
  const [{ data }] = usePostsQuery();
  // console.log("🚀 ~ file: index.tsx:11 ~ Post ~ data:", data);

  return (
    <Layout>
      <>
        {data?.posts ? (
          data?.posts.map((post) => (
            <Box mt={4}>
              <PostCard Post={post} key={post.id} />
            </Box>
          ))
        ) : (
          <Box>
            <h1>No any posts...</h1>
          </Box>
        )}
      </>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
