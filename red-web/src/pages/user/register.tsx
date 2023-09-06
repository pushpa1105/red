import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useRegisterMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

interface RegisterProps { }

interface FormInputProps {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC<RegisterProps> = ({ }) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  const submitAction = async (values: FormInputProps, { setErrors }: any) => {
    console.log(values);
    const res = await register(values);
    console.log(res);
    if (res.data?.register?.errors) {
      setErrors(toErrorMap(res.data.register.errors));
    } else if (res.data?.register.user) {
      router.push("/");
    }

    return res;
  };
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
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
              label="Username"
              name="username"
              placeholder="username"
            />
            <Box mt={4}>
              <InputField
                label="Email"
                name="email"
                placeholder="Email"
                type="email"
              />
            </Box>
            <Box mt={4}>
              <InputField
                label="Password"
                name="password"
                placeholder="Password"
                type="password"
              />
            </Box>
            <Button mt={4} color="teal" type="submit" isLoading={isSubmitting}>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
