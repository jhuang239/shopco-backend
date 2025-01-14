import User from "./user";
import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";

type UserImgAttributes = {
  id: string;
  user_id: string;
  url: string;
};

type UserImgCreationAttributes = Optional<UserImgAttributes, "id">;

@Table({
  tableName: "user_imgs",
  timestamps: true,
  modelName: "UserImg",
})
export default class UserImg extends Model<
  UserImgAttributes,
  UserImgCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare user_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare url: string;
}

export { UserImgAttributes };
