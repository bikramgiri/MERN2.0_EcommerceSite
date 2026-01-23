import {
      Table,
      Column,
      Model,
      DataType
} from 'sequelize-typescript';

// *First Method
@Table({
      tableName: 'users',
      modelName: 'User',
      timestamps: true
})

class User extends Model {
      @Column({
            primaryKey : true,
            type : DataType.UUID,
            defaultValue : DataType.UUIDV4
      })
      declare id : string;

      @Column({
            type : DataType.STRING
      })
      declare username : string;

      @Column({
            type : DataType.ENUM('customer', 'admin'),
            defaultValue : 'customer'
      })
      declare role : string;

      @Column({
            type : DataType.STRING,
            unique : true,
            allowNull : false
      })
      declare email : string;

      @Column({
            type : DataType.STRING,
            allowNull : false
      })
      declare password : string;

      @Column({
            type : DataType.STRING,
            allowNull : true
      })
      declare otp : string;

      @Column({
            type : DataType.DATE,
            allowNull : true
      })
      declare otpGeneratedTime: Date;
      

//       // Use a different alias for the association
// User.belongsToMany(Product, {
//   through: UserFavorites,
//   foreignKey: 'userId',
//   otherKey: 'productId',
//   as: 'FavoritedProducts'       // ← changed from 'favoriteProducts' to 'FavoritedProducts'
// });

// Product.belongsToMany(User, {
//   through: UserFavorites,
//   foreignKey: 'productId',
//   otherKey: 'userId',
//   as: 'UsersWhoFavorited'       // optional, but good to be consistent
// });
}

export default User;



// *2nd Methods:

// @Table({
//     tableName: 'users',
//     timestamps: true,
// })
// export class User extends Model {   // ← no generics here

//     @PrimaryKey
//     @Default(DataType.UUIDV4)
//     @Column(DataType.UUID)
//     declare id: string;

//     @AllowNull(false)
//     @Column(DataType.STRING)
//     declare username: string;

//     @AllowNull(false)
//     @Unique(true)
//     @Column(DataType.STRING)
//     declare email: string;

//     @AllowNull(false)
//     @Column(DataType.STRING)
//     declare password: string;

//     // Optional but useful for better type inference
//     declare readonly createdAt: Date;
//     declare readonly updatedAt: Date;
// }