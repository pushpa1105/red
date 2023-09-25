import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
  placeholder: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  textarea = false,
  placeholder,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      {textarea ? (
        <Textarea {...field} id={field.name} placeholder={placeholder} />
      ) : (
        <Input
          {...field}
          {...props}
          id={field.name}
          placeholder={placeholder}
        />
      )}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
