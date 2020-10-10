import Express from "express";
import { paging } from "../../utils/paging";
import EmployeeService from "./employee-service";

const type = "employees";

async function getEmployees(req: Express.Request, res: Express.Response) {
  const page = paging(req.query?.page);
  const employees = await EmployeeService.getEmployees(page);

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
}

async function getEmployeeById(req: Express.Request, res: Express.Response) {
  const employee = await EmployeeService.getEmployeeById(req.params.id);
  const { employeeId, ...attributes } = employee;

  res.json({
    data: {
      type,
      id: employeeId,
      attributes,
    },
  });
}

export { getEmployees, getEmployeeById };
export default { getEmployees, getEmployeeById };
