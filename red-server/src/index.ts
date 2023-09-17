import "reflect-metadata";
// import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
// import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import { DataSource } from "typeorm";

//redis imports
import connectRedis from "connect-redis";
// import redis from "redis";
import Redis from "ioredis";
import session from "express-session";

import { MyContext } from "./types";
import cors from "cors";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
// import { sendEmail } from "./utils/sendEmail";

export const dataSource = new DataSource({
  type: "postgres",
  database: "red2",
  username: "buffmomo",
  password: "buffmomo",
  logging: true,
  synchronize: true,
  entities: [User, Post],
});

const main = async () => {
  await dataSource.initialize();
  // const orm = await MikroORM.init(mikroOrmConfig); //connect db

  // await orm.getMigrator().up(); //run migrations

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(); // Initialize client.

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
        // disableTTL: true,
      }),
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: "buffmomo",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: "lax", //csrf
        secure: __prod__, //cookie only works in https
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  });
  // app.get('/',(_,res)=>{
  //   res.send('hello');
  // } )

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("---------------Sever started  at localhost:4000-------------");
  });
};

main().catch((err) => {
  console.error(err);
});
