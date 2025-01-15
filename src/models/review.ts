import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  Validate,
} from "sequelize-typescript";
import Product from "./product";
import User from "./user";

type ReviewAttributes = {
  id: string;
  comment: string;
  rating: number;
  user_id: string;
  product_id: string;
  comment_date: Date;
};

type ReviewCreationAttributes = Optional<ReviewAttributes, "id">;

@Table({
  tableName: "reviews",
  timestamps: true,
  modelName: "Review",
})
export default class Review extends Model<
  ReviewAttributes,
  ReviewCreationAttributes
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
  declare comment: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare rating: number;

  @ForeignKey(() => User)
  @Validate({
    async userExists(value: string) {
      const user = await User.findByPk(value);
      if (!user) {
        throw new Error("User does not exist");
      }
    },
  })
  @Column({
    type: DataType.UUID,
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
}

export { ReviewAttributes };
