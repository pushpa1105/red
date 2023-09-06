import { UsernamePasswordInput } from "src/resolvers/user";

export const validateRegister = (options: UsernamePasswordInput) => {
    if (!options.email.includes('@')) {
        return [
            {
                field: "email",
                message: "Invalid email.",
            },
        ];
    }

    if (options.password.length < 8) {
        return [
            {
                field: "password",
                message: "Password must be atleast 8 characters.",
            },
        ];
    };

    if (options.username.includes('@')) {
        return [
            {
                field: 'username',
                message: 'Invalid username'
            }
        ]
    }

    return null;
};