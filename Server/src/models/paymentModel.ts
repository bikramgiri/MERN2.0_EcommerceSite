import {
      Table,
      Column,
      Model,
      DataType,
      Default
} from 'sequelize-typescript';

@Table({
      tableName: 'payments',
      modelName: 'Payment',
      timestamps: true
})

class Payment extends Model {
      @Column({
            primaryKey : true,
            type : DataType.UUID,
            defaultValue : DataType.UUIDV4
      })
      declare id : string;

      @Column({
            type : DataType.ENUM('COD', 'Khalti', 'eSewa',),
            allowNull : false,
            defaultValue : 'COD'
      })
      declare paymentMethod : string;

      @Column({
            type : DataType.ENUM('Pending', 'Paid'),
            allowNull : false,
            defaultValue : 'Pending'
      })
      declare paymentStatus : string;

      @Column({
            type : DataType.STRING,
            allowNull : false
      })
      declare pidx : string;
}

export default Payment;