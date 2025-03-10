import { Optional } from "sequelize";
import { Table, Column, Model, DataType } from "sequelize-typescript";

type CodeAttributes = {
  id: string;
  code: string;
  type: string;
  discount: number;
  start_date: Date;
  end_date: Date;
};

type CodeCreationAttributes = Optional<CodeAttributes, "id">;

@Table({
  tableName: "codes",
  timestamps: true,
  modelName: "Code",
})
export default class Code extends Model<
  CodeAttributes,
  CodeCreationAttributes
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
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare type: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare discount: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare end_date: Date;
}

export { CodeAttributes };
