import {
  Model,
  Association,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from "sequelize";
import connection from "../../utils/db";
import OrderLog from "../order-log/order-log";

class Order extends Model {
  public orderId!: string;
  public senderId!: string | number;
  public sendAddressId!: string | number;
  public receiverId!: string | number;
  public receiveAddressId!: string | number;
  public driverId!: string | number;
  public status!: string;
  public signUrl!: string;
  public comments!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getLogs!: HasManyGetAssociationsMixin<OrderLog>;
  public addLog!: HasManyAddAssociationMixin<OrderLog, number>;
  public hasLog!: HasManyHasAssociationMixin<OrderLog, number>;
  public countLogs!: HasManyCountAssociationsMixin;
  public createLog!: HasManyCreateAssociationMixin<OrderLog>;

  public readonly logs?: OrderLog[];
  public static associations: {
    logs: Association<Order, OrderLog>;
  };
}

Order.init(
  {
    orderId: { type: new DataTypes.STRING(255), primaryKey: true },
    senderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    sendAddressId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    receiverId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    receiveAddressId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    driverId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    status: { type: new DataTypes.TEXT(), allowNull: true },
    signUrl: { type: new DataTypes.TEXT(), allowNull: true },
    comments: { type: new DataTypes.TEXT(), allowNull: true },
  },
  { tableName: "orders", sequelize: connection }
);

Order.hasMany(OrderLog, {
  foreignKey: "orderId",
  as: "logs",
});

export { Order };
export default Order;
