import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import * as argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { validatePassword, validateRegister } from "../utils/validateRegister";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { setError } from "../utils/setReturnValue";
import { dataSource } from "../index";

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class FieldError {
  @Field(() => String)
  field: string;

  @Field(() => String)
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[];

  @Field(() => User, { nullable: true })
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session!.userId) {
      return null;
    }

    const user = await User.findOneBy({ id: req.session!.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput
  ): Promise<UserResponse> {
    const errors = await validateRegister(options);

    if (errors) return { errors } as UserResponse;

    const hashedPassword = await argon2.hash(options.password);

    let user;

    try {
      const result = await dataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          {
            username: options.username,
            password: hashedPassword,
            email: options.email,
          },
        ])
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      console.log(err);
      if (err.code === "23505") {
        return {
          errors: [{ field: "username", message: "User already exists." }],
        } as UserResponse;
      }
    }

    return { user } as UserResponse;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOneBy(
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [{ field: "usernameOrEmail", message: "User not found." }],
      } as UserResponse;
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "Incorrect password" }],
      } as UserResponse;
    }

    // TODO: cookie issue ,need to fix redis-session issue with typeorm
    req.session!.userId = user.id;

    return { user } as UserResponse;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) => {
      req.session!.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        res.clearCookie(COOKIE_NAME);
        resolve(true);
      });
    });
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOneBy({ email });
    if (!user) return false;

    const token = v4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); //3 days

    await sendEmail(
      email,
      `<a href="http://localhost:3000/user/change-password/${token}">Reset Password</a>`
    );

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validatePassword(newPassword);

    if (errors) return { errors } as UserResponse;

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId)
      return { errors: setError("token", "Token expired") } as UserResponse;

    const user = await User.findOneBy({ id: parseInt(userId) });

    if (!user)
      return { errors: setError("token", "Token expired") } as UserResponse;

    await User.update(
      { id: parseInt(userId) },
      { password: await argon2.hash(newPassword) }
    );

    redis.del(key);
    req.session!.userId = user.id;

    return { user } as UserResponse;
  }
}
