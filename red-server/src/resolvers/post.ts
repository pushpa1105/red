import { MyContext } from "src/types";
import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { validateEmptyValue } from "../utils/validateEmptyValue";
import { FieldError } from "./user";
import { dataSource } from "../index";

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@ObjectType()
class PostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[];

  @Field(() => Post, { nullable: true })
  post: Post;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", { nullable: true }) cursor: string
  ): Promise<Post[]> {
    const postLimit = Math.min(limit, 20);

    const getPostsQuery = dataSource
      .getRepository(Post)
      .createQueryBuilder("user")
      .orderBy('"createdAt"', "DESC")
      .take(postLimit);

    if (cursor) {
      getPostsQuery.where('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }

    return getPostsQuery.getMany();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | null> {
    return Post.findOneBy({ id });
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<PostResponse> {
    const { title, text } = input;
    let errors = [];
    const titleError = validateEmptyValue({ field: "title", value: title });
    if (titleError) errors.push(titleError);
    const textError = validateEmptyValue({ field: "text", value: text });
    if (textError) errors.push(textError);

    if (errors && errors.length > 0) return { errors } as PostResponse;
    const post = await Post.create({
      ...input,
      creatorId: req.session!.userId,
    }).save();
    return { post } as PostResponse;
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOneBy({ id });

    if (!post) return null;

    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<Boolean> {
    await Post.delete({ id });
    return true;
  }
}
