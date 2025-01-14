import { Optional } from "sequelize";
import { Table, Column, Model, DataType } from "sequelize-typescript";

type UserAttributes = {
  id: string;
  email: string;
  username: string;
  password: string;
  type: string;
};

type UserCreationAttributes = Optional<UserAttributes, "id">;

@Table({
  tableName: "users",
  timestamps: true,
  modelName: "User",
})
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
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
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "user",
  })
  declare type: string;
}

export { UserAttributes };
