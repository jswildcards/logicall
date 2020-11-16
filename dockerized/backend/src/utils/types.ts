import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export interface Context {
  prisma: PrismaClient;
  request: Request;
  response: Response;
}
