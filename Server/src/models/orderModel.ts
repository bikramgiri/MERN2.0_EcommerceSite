import {
      Table,
      Column,
      Model,
      DataType,
      Default
} from 'sequelize-typescript';

@Table({
      tableName: 'orders',
      modelName: 'Order',
      timestamps: true
})

class Order extends Model {
      @Column({
            primaryKey : true,
            type : DataType.UUID,
            defaultValue : DataType.UUIDV4
      })
      declare id : string;

      @Column({
            type : DataType.STRING,
            allowNull : false,
            // validate : {
            //       len : {
            //             args : [10,10],
            //             msg : "Phone number must be exactly 10 digits long."
            //       }
            // }
      })
      declare phoneNumber : string;

      @Column({
            type : DataType.STRING,
            allowNull : false
      })
      declare shippingAddress : string;

      @Column({
            type : DataType.FLOAT,
            allowNull : false
      })
      declare totalAmount : number;

      @Column({
            type : DataType.ENUM('Pending', 'Cancelled', 'Delivered', 'Preparation', 'In Transit'),
            allowNull : false,
            defaultValue : 'Pending'
      })
      declare orderStatus : string;
}

export default Order;