import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import Product from "./product";

type ReviewAttributes = {
  id: number;
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
    type: DataType.INTEGER,
    autoIncrement: true,
    defaultValue: DataType.INTEGER,
  })
  declare id: number;

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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare user_id: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare product_id: string;
}

export { ReviewAttributes };
