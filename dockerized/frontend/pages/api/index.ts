import { ApolloServer } from "apollo-server-micro";
import fs from "fs";
import path from "path";
import { PrismaClient, User as UserModel } from "@prisma/client";
import { makeSchema, objectType } from "nexus";
import resolvers from "./resolvers/root";
import { Cookie as CookieConfig } from "./utils/config";
import jwt from "./utils/token";

const typeDefs = fs.readFileSync(
  path.join(process.cwd(), "pages/api/schema.graphql"),
  "utf8"
);

const prisma = new PrismaClient();

// const User = objectType({
//   name: "User",
//   definition: (t) => {
//     t.int("userId")
//   }
// });

// const Query = objectType({
//   name: "Query",
//   definition: (t) => {
//     t.list.field("users", {
//       type: "User",
//       resolve: (_, args, context) => {
//         return prisma.user.findMany({});
//       }
//     })
//   }
// })

// export const schema = makeSchema({
//   types: [Query, User],
//   outputs: {
//     typegen: path.join(process.cwd(), "pages/api/nexus-typegen.ts"),
//     schema: path.join(process.cwd(), "pages/api/schema.graphql"),
//   }
// })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default new ApolloServer({
  // schema,
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    let auth: UserModel | null = null;
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
