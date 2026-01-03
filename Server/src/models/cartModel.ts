import {
      Table,
      Column,
      Model,
      DataType
} from 'sequelize-typescript';

@Table({
      tableName: 'carts',
      modelName: 'cart',
      timestamps: true
})

class Cart extends Model {
      @Column({
            primaryKey : true,
            type : DataType.UUID,
            defaultValue : DataType.UUIDV4
      })
      declare id : string;

      @Column({
            type : DataType.INTEGER,
            defaultValue : 1,
            allowNull : false
      })
      declare quantity : number;
}

export default Cart;