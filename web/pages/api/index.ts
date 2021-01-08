import { PrismaClient, User as UserModel } from "@prisma/client";
import { ApolloServer } from "apollo-server-micro";
import fs from "fs";
import { PubSub } from "graphql-subscriptions";
import resolvers from "./resolvers/root";
import { Cookie as CookieConfig } from "./utils/config";
import jwt from "./utils/token";

const typeDefs = fs.readFileSync("schema.gql", "utf8");
const prisma = new PrismaClient();
const pubsub = new PubSub();

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
      return { context: connection.context, pubsub };
    }

    let auth: UserModel;
    const token = req?.cookies?.[CookieConfig.token];
    if (token) {
      auth = (await jwt.verify(token)) as UserModel;
    }

    return {
      request: req,
      response: res,
      prisma,
      pubsub,
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
