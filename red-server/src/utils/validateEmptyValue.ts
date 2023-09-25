interface ValidateFieldProps {
  field?: String;
  value: String;
}

export const validateEmptyValue = ({ field, value }: ValidateFieldProps) => {
  if (value.length < 1) {
    return {
      field,
      message: `${field} cannot be empty.`,
    };
  }
  return null;
};
