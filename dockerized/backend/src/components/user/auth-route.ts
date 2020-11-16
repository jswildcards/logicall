import express from "express";
import { signInUser } from "./user-controller";

const router = express.Router();
router.post("/", signInUser);

export default router;
