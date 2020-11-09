import { DataTypes, Model } from "sequelize";
import connection from "../../utils/db";
// import Order from "../order/order";

class OrderLog extends Model {
  public orderLogId?: string | number;
  public orderId?: string;
  public status?: string;
  public comments?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt?: Date;
}

OrderLog.init(
  {
    orderLogId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: { type: new DataTypes.STRING(255), allowNull: true },
    status: { type: new DataTypes.TEXT(), allowNull: true },
    comments: { type: new DataTypes.TEXT(), allowNull: true },
  },
  {
    tableName: "orderLogs",
    sequelize: connection,
    paranoid: true,
    timestamps: true,
  },
);

export { OrderLog };
export default OrderLog;
