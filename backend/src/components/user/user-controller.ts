import Express from "express";
import { encrypt } from "../../utils/crypto";
import { paging } from "../../utils/paging";
import UserService from "./user-service";

const type = "users";

async function getUsers(req: Express.Request, res: Express.Response) {
  const page = paging(req.query?.page);
  const users = await UserService.getUsers(page);

  res.json({
    data: users.map((user) => {
      const { userId, ...attributes } = user.get();

      return {
        type,
        id: userId,
        attributes,
        // TODO: relationships to be implemented
        relationships: null,
      };
    }),
  });
}

async function getUserById(req: Express.Request, res: Express.Response) {
  const user = await UserService.getUserById(req.params.id);

  if (user) {
    const { userId, ...attributes } = user.get();

    res.json({
      data: {
        type,
        id: userId,
        attributes,
      },
    });
    return;
  }

  res.status(404).json({ error: "Requested resources not found." });
}

async function createUser(req: Express.Request, res: Express.Response) {
  req.body.password = encrypt(req.body.password);
  const user = await UserService.createUser(req.body);
  const { userId, ...attributes } = user.get();

  res.status(201).json({
    data: {
      type,
      id: userId,
      attributes,
    },
  });
}

// TODO: Test Update User Function
async function updateUser(req: Express.Request, res: Express.Response) {
  if (req.body?.password) {
    req.body.password = encrypt(req.body.password);
  }
  const [updated] = await UserService.updateUser(req.params.id, req.body);
  if (updated) {
    const user = await UserService.getUserById(req.params.id);
    res.json(user);
    return;
  }

  res.status(404).json({ error: "Requested resources not found." });
}

async function deleteUser(req: Express.Request, res: Express.Response) {
  const user = await UserService.getUserById(req.params.id);
  if (user) {
    UserService.deleteUser(user);
    res.json({ status: "success" });
    return;
  }
  res.status(404).json({ error: "Requested resources not found." });
}

async function signInUser(req: Express.Request, res: Express.Response) {
  req.body.password = encrypt(req.body.password);
  const user = await UserService.getUserByAuth(req.body);
  if (user) {
    const { userId, ...attributes } = user.get();

    res.json({
      data: {
        type,
        id: userId,
        attributes,
      },
    });
    return;
  }
  res.status(404).json({ error: "Requested resources not found." });
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
