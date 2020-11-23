import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

export interface Context {
  auth: User;
  prisma: PrismaClient;
  request: Request;
  response: Response;
}
