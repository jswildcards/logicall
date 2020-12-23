import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export interface Context {
  auth: User;
  prisma: PrismaClient;
  request: NextApiRequest;
  response: NextApiResponse;
}
