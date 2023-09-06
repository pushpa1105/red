import React from "react";
import { Wrapper } from "../../components/Wrapper";
import { Form, Formik } from "formik";
import { useLoginMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { Box, Button } from "@chakra-ui/react";
import { InputField } from "../../components/InputField";
import { useRouter } from "next/router";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

interface LoginProps {}

interface FormInputProps {
  usernameOrEmail: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  const submitAction = async (values: FormInputProps, { setErrors }: any) => {
    console.log(values);
    const res = await login(values);

    if (res.data?.login?.errors) {
      setErrors(toErrorMap(res.data.login.errors));
    } else if (res.data?.login.user) {
      router.push("/");
    }
  };

  return (
    <Wrapper>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
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
            <InputField
              label="Username/Email"
              name="usernameOrEmail"
              placeholder="Username or Email"
            />
            <Box mt={4}>
              <InputField
                label="Password"
                name="password"
                placeholder="Password"
                type="password"
              />
            </Box>
            <Button mt={4} color="teal" type="submit" isLoading={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
