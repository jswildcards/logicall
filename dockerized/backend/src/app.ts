import express from "express";
import cookieParser from "cookie-parser";
import addressRoute from "./components/address/address-route";
import userRoute from "./components/user/user-route";
import orderRoute from "./components/order/order-route";
import orderLogRoute from "./components/order-log/order-log-route";
import authRoute from "./components/user/auth-route";
import "./components/relationships";

const router = express.Router();
const app = express();

app.use(express.json());
app.use(cookieParser());

router.use("/addresses", addressRoute);
router.use("/users", userRoute);
router.use("/orders", orderRoute);
router.use("/order-logs", orderLogRoute);
router.use("/auth", authRoute);

app.use("/api", router);

export default app;
