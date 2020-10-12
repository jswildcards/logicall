import Express from "express";
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

export { getUsers, getUserById };
export default { getUsers, getUserById };
