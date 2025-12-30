import {
      Table,
      Column,
      Model,
      DataType
} from 'sequelize-typescript';

@Table({
      tableName: 'products',
      modelName: 'Product',
      timestamps: true
})

class Product extends Model {
      @Column({
            primaryKey : true,
            type : DataType.UUID,
            defaultValue : DataType.UUIDV4
      })
      declare id : string;

      @Column({
            type : DataType.STRING,
            allowNull : false
      })
      declare productName : string;

      @Column({
            type : DataType.STRING,
            allowNull : false
      })
      declare productImage : string;

      @Column({
            type : DataType.INTEGER,
            allowNull : false
      })
      declare productPrice : number;

      @Column({
            type : DataType.INTEGER,
            allowNull : false,
            defaultValue : 0
      })
      declare productTotalStockQty : number;

      @Column({
            type : DataType.TEXT,
            allowNull : false
      })
      declare productDescription : string;
}

export default Product;