import { Box, Button, Link as CLink, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import React, { useState } from "react";
import { InputField } from "../../../components/InputField";
import { Wrapper } from "../../../components/Wrapper";
import { useChangePasswordMutation } from "../../../generated/graphql";
import { toErrorMap } from "../../../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import Link from "next/link";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [error, setError] = useState("");
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();

  const submitAction = async (values: { newPassword: string }) => {
    console.log({ ...values, token });
    const res = await changePassword({ ...values, token });

    if (res.data?.changePassword?.errors) {
      setError(res.data.changePassword.errors[0].message);
    } else if (res.data?.changePassword.user) {
      router.push("/");
    }
  };
  return (
    <Wrapper>
      <Formik
        initialValues={{ newPassword: "" }}
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
            <Box mt={4}>
              <InputField
                label="New Password"
                name="newPassword"
                placeholder="New Password"
                type="password"
              />
              {error && <Box style={{ color: "red" }}>{error}</Box>}
            </Box>
            <Flex>
              <Button
                mt={4}
                color="teal"
                type="submit"
                isLoading={isSubmitting}
              >
                New Password
              </Button>
              <Box marginTop={6} marginRight={8}>
                <CLink as={Link} mr={2} href={"/user/forgot-password"}>
                  Resend email?
                </CLink>
              </Box>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
