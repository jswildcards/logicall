import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  signInUser,
  updateUser,
} from "./user-controller";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.post("/sign-in", signInUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
