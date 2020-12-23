import { PrismaClient, User as UserModel } from "@prisma/client";
import { ApolloServer } from "apollo-server-micro";
import fs from "fs";
import resolvers from "./resolvers/root";
import { Cookie as CookieConfig } from "./utils/config";
import jwt from "./utils/token";

const typeDefs = fs.readFileSync("schema.gql", "utf8");
const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    let auth: UserModel;
    const token = req?.cookies?.[CookieConfig.token];
    if (token) {
      auth = (await jwt.verify(token)) as UserModel;
    }

    return {
      request: req,
      response: res,
      prisma,
      auth,
    };
  },
}).createHandler({ path: "/api" });
