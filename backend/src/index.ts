import express from "express";
import customerRoute from "./components/customer/customer-route";
import customerAddressRoute from "./components/customer-address/customer-address-route";
import employeeRoute from "./components/employee/employee-route";
import orderRoute from "./components/order/order-route";
import orderLogRoute from "./components/order-log/order-log-route";

const router = express.Router();
const app = express();

app.use(express.json());

router.use("/customers", customerRoute);
router.use("/customer-addresses", customerAddressRoute);
router.use("/employees", employeeRoute);
router.use("/orders", orderRoute);
router.use("/order-logs", orderLogRoute);

app.use("/api", router);

app.listen(3000);
