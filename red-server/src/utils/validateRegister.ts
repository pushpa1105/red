import { UsernamePasswordInput } from "src/resolvers/user";

export const validateRegister = (options: UsernamePasswordInput) => {
  const passwordError = validatePassword(options.password);

  if (passwordError) return passwordError;

  const emailError = validateEmail(options.email);

  if (emailError) return emailError;

  return null;
};

export const validatePassword = (password: string) => {
  if (password.length < 8) {
    return [
      {
        field: "password",
        message: "Password must be atleast 8 characters.",
      },
    ];
  }

  return null;
};

export const validateEmail = (email: string) => {
  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email.",
      },
    ];
  }

  return null;
};
