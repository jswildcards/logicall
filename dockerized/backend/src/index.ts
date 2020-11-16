import { GraphQLServer } from "graphql-yoga";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { Context } from "graphql-yoga/dist/types";
import resolvers from "./resolvers/root";

const typeDefs = fs.readFileSync(
  path.join(__dirname, "../schema.graphql"),
  "utf8"
);

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: ({ request, response }: Context) => {
    return {
      request,
      response,
      prisma: new PrismaClient(),
    };
  },
});

server.express.use(cookieParser());
server.start(() => console.log(`Server is running on http://localhost:4000`));
