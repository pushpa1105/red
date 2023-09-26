import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import { Flex, Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputField } from "../../components/InputField";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import {
  PostInput,
  useCreatePostMutation,
  useMeQuery,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { toErrorMap } from "../../utils/toErrorMap";
import { useIsAuth } from "../../utils/useIsAuth";

const CreatePost = () => {
  const [{ data, fetching }] = useMeQuery();
  const [, createPost] = useCreatePostMutation();
  const route = useRouter();
  useIsAuth(route.pathname);

  const submitAction = async (values: PostInput, { setErrors }: any) => {
    const res = await createPost({ input: values });
    console.log(res);
    if (res?.data?.createPost?.errors) {
      setErrors(toErrorMap(res?.data?.createPost?.errors));
    } else if (res?.data?.createPost?.post) {
      console.log(res?.data?.createPost?.post);
      route.push("/post");
    }
  };

  return (
    <Layout variant="regular">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={submitAction}
        // onSubmit={function (
        //   values: FormikValues,
        //   formikHelpers: FormikHelpers<FormikValues>
        // ): void | Promise<any> {
        //   throw new Error("Function not implemented.");
        // }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Title" name="title" placeholder="Title" />
            <Box mt={4}>
              <InputField
                label="Text"
                name="text"
                placeholder="Text"
                textarea
              />
            </Box>
            <Flex justifyContent={"space-between"}>
              <Button
                mt={4}
                color="teal"
                type="submit"
                isLoading={isSubmitting}
              >
                Create Post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
