import Address from "./address/address";
import OrderLog from "./order-log/order-log";
import Order from "./order/order";
import User from "./user/user";

User.hasMany(Address, {
  foreignKey: "addressId",
  as: "addresses",
});

User.hasMany(Order, {
  foreignKey: "senderId",
  as: "sendOrders",
});

User.hasMany(Order, {
  foreignKey: "receiverId",
  as: "receiveOrders",
});

User.hasMany(Order, {
  foreignKey: "driverId",
  as: "deliverOrders",
});

// `customerId` will be added on CustomerAddress / Source model
Address.belongsTo(User, {
  targetKey: "userId",
  foreignKey: "customerId",
  as: "customer",
  // constraints: false,
});

Order.hasMany(OrderLog, {
  foreignKey: "orderId",
  as: "logs",
});

OrderLog.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
  // constraints: false,
});
