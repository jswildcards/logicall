import express from "express";
import { getEmployees, getEmployeeById } from "./employee-controller";

const router = express.Router();
const type = "employees";

router.get("/", async (_, res) => {
  const employees = await getEmployees();

  res.json({
    data: employees.map((employee) => {
      const { employeeId, ...attributes } = employee;

      return {
        type,
        id: employeeId,
        attributes,
        // TODO: relationships to be implemented
        relationships: null,
      };
    }),
  });
});

router.get("/:id", async (req, res) => {
  const employee = await getEmployeeById({ employeeId: req.params.id });
  const { employeeId, ...attributes } = employee;

  res.json({
    data: {
      type,
      id: employeeId,
      attributes,
    },
  });
});

export default router;
