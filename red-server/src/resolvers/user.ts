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
// import { RequiredEntityData } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { validatePassword, validateRegister } from "../utils/validateRegister";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { setError } from "../utils/setReturnValue";

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
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session!.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session!.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const errors = await validateRegister(options);

    if (errors) return { errors } as UserResponse;

    const hashedPassword = await argon2.hash(options.password);

    let user;
    // const user = em.create(User, {
    //   username: options.username,
    //   password: hashedPassword,
    // } as RequiredEntityData<User>);

    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          email: options.email,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      user = result[0];
      // await em.persistAndFlush(user);
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
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
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
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });
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
    @Ctx() { redis, em, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validatePassword(newPassword);

    if (errors) return { errors } as UserResponse;

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId)
      return { errors: setError("token", "Token expired") } as UserResponse;

    const user = await em.findOne(User, { id: parseInt(userId) });

    if (!user)
      return { errors: setError("token", "Token expired") } as UserResponse;

    user.password = await argon2.hash(newPassword);

    await em.persistAndFlush(user);

    redis.del(key);
    req.session!.userId = user.id;

    return { user } as UserResponse;
  }
}
