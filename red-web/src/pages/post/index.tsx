import React, { useState } from "react";
import PostCard from "../../components/Post/PostCard";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import Layout from "../../components/Layout";
import { usePostsQuery } from "../../generated/graphql";
import { Box, Button, Center } from "@chakra-ui/react";

const Post = () => {
  const [variables, setVariables] = useState({
    limit: 5,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  return (
    <Layout>
      <>
        {!fetching && data?.posts && data.posts.length > 0 ? (
          <>
            {data?.posts.map((post) => (
              <Box mt={4} key={post.id}>
                <PostCard Post={post} key={post.id} />
              </Box>
            ))}
            <Button
              isLoading={fetching}
              colorScheme="blue"
              display={"flex"}
              m={"auto"}
              my={10}
              w={"20vw"}
              h={50}
              onClick={() => {
                setVariables({
                  limit: 5,
                  cursor: data?.posts[data?.posts.length - 1].createdAt,
                });
              }}
            >
              Load More
            </Button>
          </>
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
