import { FieldError } from "src/resolvers/user";

export const setError = (field: string, message: string): FieldError[] => {
  return [
    {
      field,
      message,
    },
  ];
};
