import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import User from "./userModel";
import Product from "./productModel";

@Table({
  tableName: "reviews",
  modelName: "review",
  timestamps: true,
})
class Review extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

   @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare productId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      min: {
        args: [5],
        msg: "Review must be at least 5 characters long.",
      },
      max: {
        args: [100],
        msg: "Review must be at most 100 characters long.",
      },
    },
  })
  declare message: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: "Rating must be at least 1.",
      },
      max: {
        args: [5],
        msg: "Rating must be at most 5.",
      },
    },
  })
  declare rating: number;

  @Column({
    type: DataType.STRING,
    allowNull: true, // Image is optional
    defaultValue: null,
  })
  declare reviewImage: string; 

  // @Column({
  //       type : DataType.BOOLEAN,
  //       defaultValue : false
  // })
  // declare isApproved : boolean;
}

export default Review;
