import { PrismaClient, User } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Redis } from "ioredis";
import { NextApiRequest, NextApiResponse } from "next";

export interface Context {
  auth: User;
  prisma: PrismaClient;
  request: NextApiRequest;
  response: NextApiResponse;
  pubsub: PubSub;
  redis: Redis;
}

// export interface Page {
//   page: number;
//   size: number;
// }
