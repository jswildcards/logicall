import { Response } from "express";

export const Unauthorized = (res: Response) =>
  res.status(401).json({ message: "Unauthorized." });

export const NotFound = (res: Response) =>
  res.status(404).json({ message: "Not Found." });

export const SignInSuccess = (res: Response) =>
  res.json({ message: "SignInSuccess" });

export default { Unauthorized, NotFound, SignInSuccess };
