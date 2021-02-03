import { User as UserModel } from "@prisma/client";
import { ApolloServer } from "apollo-server-micro";
import fs from "fs";
import resolvers from "./resolvers/root";
import { Cookie as CookieConfig } from "./utils/config";
import jwt from "./utils/token";
import { prisma, pubsub, redis } from "./utils/init";

const typeDefs = fs.readFileSync("schema.gql", "utf8");

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res, connection }) => {
    if (connection) {
      return { context: connection.context, pubsub, redis };
    }

    let auth: UserModel;
    const token = req?.cookies?.[CookieConfig.token];
    if (token) {
      auth = (await jwt.verify(token).catch(() => null)) as UserModel;
    }

    return {
      request: req,
      response: res,
      prisma,
      pubsub,
      redis,
      auth,
    };
  },
  subscriptions: {
    path: "/api",
    keepAlive: 9000,
    onConnect: () => console.log("connected"),
    onDisconnect: () => console.log("disconnected"),
  },
  playground: {
    subscriptionEndpoint: "/api",
    settings: {
      "request.credentials": "same-origin",
    },
  },
});

export default (req, res, next) => {
  if (!res.socket.server.apolloServer) {
    console.log(`* apolloServer first use *`);

    apolloServer.installSubscriptionHandlers(res.socket.server);
    const handler = apolloServer.createHandler({ path: "/api" });
    res.socket.server.apolloServer = handler;
  }

  return res.socket.server.apolloServer(req, res, next);
};
