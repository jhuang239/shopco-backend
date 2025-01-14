import { Optional } from "sequelize";
import { Table, Column, Model, DataType } from "sequelize-typescript";
import User from "./user";
import Product from "./product";

type CartAttributes = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
};

type CartCreationAttributes = Optional<CartAttributes, "id">;

@Table({
  tableName: "carts",
  timestamps: true,
  modelName: "Cart",
})
export default class Cart extends Model<
  CartAttributes,
  CartCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare user_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare product_id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;
}

export { CartAttributes };
