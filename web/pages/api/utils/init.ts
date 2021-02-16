import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import Redis from "ioredis";
import { RedisHost as host } from "./config";

export const prisma = new PrismaClient();
export const pubsub = new PubSub();
export const redis = new Redis({ host });

export default { prisma, pubsub, redis };
