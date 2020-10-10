import express from "express";
import { getEmployees, getEmployeeById } from "./employee-controller";

const router = express.Router();

router.get("/", getEmployees);
router.get("/:id", getEmployeeById);

export default router;
