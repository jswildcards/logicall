import Express from "express";
import { encrypt } from "../../utils/crypto";
import { paging } from "../../utils/paging";
import jwt from "../../utils/token";
import UserService from "./user-service";
import { Cookie as CookieConfig } from "../../utils/config";
import { NotFound, SignInSuccess, Unauthorized } from "../../utils/httpStatus";

async function getUsers(req: Express.Request, res: Express.Response) {
  const page = paging(req.query?.page);
  const users = await UserService.getUsers(page);

  const token = req.cookies[CookieConfig.token];
  const payload = (await jwt.verify(token)) as Record<string, any>;

  if ((payload?.role ?? "") !== "admin") {
    Unauthorized(res);
    return;
  }

  res.json(users);
}

async function getUserById(req: Express.Request, res: Express.Response) {
  const user = await UserService.getUserById(req.params.id);

  if (!user) {
    NotFound(res);
    return;
  }

  res.json(user.get());
}

async function createUser(req: Express.Request, res: Express.Response) {
  req.body.password = encrypt(req.body.password);
  const user = await UserService.createUser(req.body);
  res.status(201).json(user);
}

// TODO: Test Update User Function
async function updateUser(req: Express.Request, res: Express.Response) {
  if (req.body?.password) {
    req.body.password = encrypt(req.body.password);
  }
  const [updated] = await UserService.updateUser(req.params.id, req.body);
  if (!updated) {
    NotFound(res);
    return;
  }

  const user = await UserService.getUserById(req.params.id);
  res.json(user);
}

async function deleteUser(req: Express.Request, res: Express.Response) {
  const user = await UserService.getUserById(req.params.id);

  if (!user) {
    NotFound(res);
    return;
  }

  UserService.deleteUser(user);
  res.json({ status: "success" });
}

async function signInUser(req: Express.Request, res: Express.Response) {
  req.body.password = encrypt(req.body.password);
  const user = await UserService.getUserByAuth(req.body);

  if (!user) {
    NotFound(res);
    return;
  }

  res.cookie(CookieConfig.token, await jwt.assign(user.get()), {
    httpOnly: true,
  });

  SignInSuccess(res);
}

export {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  signInUser,
  updateUser,
};
export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  signInUser,
};
