import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";

export default {
    migrations: {
        path: path.join(__dirname,'./migrations'), // path to the folder with migrations   
    },
    entities: [Post, User],
    dbName: "red",
    user: 'buffmomo', // Your PostgreSQL username
    password: 'buffmomo', // Your PostgreSQL password
    host: 'localhost', // Your PostgreSQL host
    port: 5432, // Your PostgreSQL port
    type: "postgresql",
    allowGlobalContext: true,
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
