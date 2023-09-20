import React from "react";
import Layout from "../../components/Layout";
import { Flex, Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputField } from "../../components/InputField";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { PostInput, useCreatePostMutation } from "../../generated/graphql";

const CreatePost = () => {
  const [, createPost] = useCreatePostMutation();

  const submitAction = async (values: PostInput, { setErrors }: any) => {
    const res = await createPost({ input: values });

    console.log(res);
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
              <InputField label="Text" name="text" placeholder="Text" />
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
