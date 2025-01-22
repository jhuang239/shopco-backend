import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  Validate,
} from "sequelize-typescript";
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

  @ForeignKey(() => User)
  @Validate({
    async userExists(value: string) {
      const user = await User.findAll({ where: { username: value } });
      if (!user) {
        throw new Error("User does not exist");
      }
    },
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare user_id: string;

  @ForeignKey(() => Product)
  @Validate({
    async productExists(value: string) {
      const product = await Product.findByPk(value);
      if (!product) {
        throw new Error("Product does not exist");
      }
    },
  })
  @Column({
    type: DataType.UUID,
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
