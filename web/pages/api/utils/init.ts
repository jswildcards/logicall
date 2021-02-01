import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import redisClient from "redis";
import { redisHost as host } from "./config";

export const prisma = new PrismaClient();
export const pubsub = new PubSub();
export const redis = redisClient.createClient({ host });

export default { prisma, pubsub, redis };
