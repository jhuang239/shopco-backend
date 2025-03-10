import { Optional } from "sequelize";
import { Table, Column, Model, DataType } from "sequelize-typescript";

type BrandAttributes = {
  id: string;
  name: string;
};

type BrandCreationAttributes = Optional<BrandAttributes, "id">;

@Table({
  tableName: "brands",
  timestamps: true,
  modelName: "Brand",
})
export default class Brand extends Model<
  BrandAttributes,
  BrandCreationAttributes
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

export { BrandAttributes };
