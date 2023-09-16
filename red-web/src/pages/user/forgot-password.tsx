import { Box, Button, Link as CLink } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import error from "next/error";
import Link from "next/link";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useForgotPasswordMutation } from "../../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useState } from "react";

const ForgotPassword = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitAction = async (
    values: { email: string },
    { setErrors }: any
  ) => {
    const res = await forgotPassword(values);
    console.log(res.data?.forgotPassword);
    if (res.data?.forgotPassword) {
      setError('');
      setSuccess("Email sent successfully. Check you email.");
    } else {
      setSuccess('');
      setError("Failed to sent email.");
    }
  };

  return (
    <Wrapper>
      <Formik initialValues={{ email: "" }} onSubmit={submitAction}>
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                label="Email"
                name="email"
                placeholder="Email"
                type="email"
              />
              <Box style={{ color: error ? "red" : "green" }}>
                {error ? error : success}
              </Box>
            </Box>
            <Button mt={4} color="teal" type="submit" isLoading={isSubmitting}>
              Send Email
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
