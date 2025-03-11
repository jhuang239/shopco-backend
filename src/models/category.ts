import { Optional } from "sequelize";
import { Table, Column, Model, DataType } from "sequelize-typescript";

type CategoryAttributes = {
  id: string;
  name: string;
};

type CategoryCreationAttributes = Optional<CategoryAttributes, "id">;

@Table({
  tableName: "categories",
  timestamps: true,
  modelName: "Category",
})
export default class Category extends Model<
  CategoryAttributes,
  CategoryCreationAttributes
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
  declare name: string;
}

export { CategoryAttributes };
