import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import redisClient from "redis";

export const prisma = new PrismaClient();
export const pubsub = new PubSub();
export const redis = redisClient.createClient();

export default { prisma, pubsub, redis };
