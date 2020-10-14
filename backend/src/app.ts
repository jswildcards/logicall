import express from "express";
import addressRoute from "./components/address/address-route";
import userRoute from "./components/user/user-route";
import orderRoute from "./components/order/order-route";
import orderLogRoute from "./components/order-log/order-log-route";
import "./components/relationships";

const router = express.Router();
const app = express();

app.use(express.json());

router.use("/addresses", addressRoute);
router.use("/users", userRoute);
router.use("/orders", orderRoute);
router.use("/order-logs", orderLogRoute);

app.use("/api", router);

export default app;
