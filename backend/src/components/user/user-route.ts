import express from "express";
import { getUserById, getUsersByPage } from "./user-controller";

const router = express.Router();

const type = "users";

router.get("/", async (_, res, next) => {
  const { offset, size } = res.locals;
  const rows = await getUsersByPage({ offset, size });

  res.locals = {
    ...res.locals,
    rows,
    type,
  };

  next();
});

router.get("/:id", async (req, res, next) => {
  const rows = await getUserById({ id: req.params.id });
  const isSingleObject = true;

  res.locals = {
    ...res.locals,
    rows,
    type,
    isSingleObject,
  };

  next();
});

export default router;
