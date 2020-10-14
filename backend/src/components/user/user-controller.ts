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
  res.status(201).json(user);
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

export { getUsers, getUserById, createUser, deleteUser };
export default { getUsers, getUserById, createUser, deleteUser };
