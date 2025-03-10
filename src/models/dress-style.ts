import { Optional } from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    Validate,
} from "sequelize-typescript";

type DressStyleAttributes = {
    id: string;
    name: string;
};

type DressStyleCreationAttributes = Optional<DressStyleAttributes, "id">;

@Table({
    tableName: "dress_styles",
    timestamps: true,
    modelName: "DressStyle",
})
export default class DressStyle extends Model<
    DressStyleAttributes,
    DressStyleCreationAttributes
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

export { DressStyleAttributes };