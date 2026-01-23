import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import User from './userModel';
import Product from './productModel';

@Table({
  tableName: 'user_favorites',
  timestamps: true,
})
class UserFavorites extends Model {
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
}

export default UserFavorites;