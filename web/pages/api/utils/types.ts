import { PrismaClient, User } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { NextApiRequest, NextApiResponse } from "next";

export interface Context {
  auth: User;
  prisma: PrismaClient;
  request: NextApiRequest;
  response: NextApiResponse;
  pubsub: PubSub;
}

export interface Page {
  page: number
  size: number
}
