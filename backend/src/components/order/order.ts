import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Model,
} from "sequelize";
import connection from "../../utils/db";
import OrderLog from "../order-log/order-log";

class Order extends Model {
  public orderId?: string;
  public senderId?: string | number;
  public sendAddressId?: string | number;
  public receiverId?: string | number;
  public receiveAddressId?: string | number;
  public driverId?: string | number;
  public status?: string;
  public signUrl?: string;
  public comments?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt?: Date;

  public getLogs?: HasManyGetAssociationsMixin<OrderLog>;
  public addLog?: HasManyAddAssociationMixin<OrderLog, number>;
  public hasLog?: HasManyHasAssociationMixin<OrderLog, number>;
  public countLogs?: HasManyCountAssociationsMixin;
  public createLog?: HasManyCreateAssociationMixin<OrderLog>;

  public readonly logs?: OrderLog[];
  public static associations: {
    logs: Association<Order, OrderLog>;
  };
}

Order.init(
  {
    orderId: { type: new DataTypes.STRING(255), primaryKey: true },
    senderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    sendAddressId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    receiverId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    receiveAddressId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    driverId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    status: { type: new DataTypes.TEXT(), allowNull: true },
    signUrl: { type: new DataTypes.TEXT(), allowNull: true },
    comments: { type: new DataTypes.TEXT(), allowNull: true },
  },
  {
    tableName: "orders",
    sequelize: connection,
    paranoid: true,
    timestamps: true,
  },
);

export { Order };
export default Order;
