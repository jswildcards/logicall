import { GraphQLServer } from "graphql-yoga";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import { PrismaClient, User } from "@prisma/client";
import { Context } from "graphql-yoga/dist/types";
import resolvers from "./resolvers/root";
import { Cookie as CookieConfig } from "./utils/config";
import jwt from "./utils/token";

const port = process?.env?.PORT ?? 4000;

const typeDefs = fs.readFileSync(
  path.join(__dirname, "../schema.graphql"),
  "utf8",
);

const prisma = new PrismaClient();

// // TODO: test delete record
// prisma.$use((params, next) => {
//   const findMethods = ["findOne", "findMany", "findFirst"];

//   if (params.action === "delete") {
//     params.action = "update";
//     params.args.data = { deletedAt: new Date() };
//   }

//   if (findMethods.includes(params.action)) {
//     params.args.where = { ...params.args.where, deletedAt: null };
//   }

//   return next(params);
// });

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: async ({ request, response }: Context) => {
    let auth: User | null = null;
    const token = request.cookies[CookieConfig.token];
    if (token) {
      auth = (await jwt.verify(token)) as User;
    }

    return {
      request,
      response,
      prisma,
      auth,
    };
  },
});

server.express.use(cookieParser());
server.start(
  { endpoint: "/graphql", port, cors: { credentials: true } },
  ({ endpoint }) => console.log(`Server is running on ${endpoint}`),
);
