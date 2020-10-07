import express from "express";
import customerRoute from "./components/customer/customer-route";
import customerAddressRoute from "./components/customer-address/customer-address-route";
import employeeRoute from "./components/employee/employee-route";
import orderRoute from "./components/order/order-route";
import orderLogRoute from "./components/order-log/order-log-route";

const router = express.Router();
const app = express();

const PAGE_NUMBER = 1;
const PAGE_SIZE = 20;

// TODO: implement Authorization method (probably using JWT)
// EDIT: should be moved to [AUTH SERVICE]
app.use((req, res, next) => {
  // if(!req.headers.authorization) {
  //   res.status(400).json({ error: {} });
  //   return;
  // }

  const page = req.query.page as { number: string; size: string }; // number = 2, size = 5 => (5, 5) gives row 6 - 10
  const number = Number(page?.number) || PAGE_NUMBER;
  const size = Number(page?.size) || PAGE_SIZE;
  const offset = size * (number - 1);

  res.locals = {
    ...res.locals,
    number,
    size,
    offset,
  };

  next();
});

router.use("/customers", customerRoute);
router.use("/customer-addresses", customerAddressRoute);
router.use("/employees", employeeRoute);
router.use("/orders", orderRoute);
router.use("/order-logs", orderLogRoute);

app.use("/api", router);

app.listen(3000);
