import {Sequelize} from 'sequelize-typescript';
import User from '../models/userModel';
import Product from '../models/productModel';
import Category from '../models/categoryModel';
import Cart from '../models/cartModel';

const sequelize = new Sequelize({
      database : process.env.DB_NAME as string,
      dialect: process.env.DB_DIALECT as any,
      username : process.env.DB_USERNAME as string,
      password : process.env.DB_PASSWORD as string,
      host : process.env.DB_HOST as string,
      port : Number(process.env.DB_PORT),
      models: [__dirname + '/../models']
});

sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.')
      })
      .catch(err => {
            console.error('Unable to connect to the database:', err)
      })

sequelize
  .sync({ force: false, alter: false })
  .then(() => {
    console.log('Models synced successfully!');
  })
  .catch((err) => {
    console.error('Sync failed:', err);
  });

// *Relationships between models
// User.hasMany(Product)
// Product.belongsTo(User)
// or
User.hasMany(Product, { foreignKey: 'userId' });
Product.belongsTo(User, { foreignKey: 'userId' });

Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

Cart.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Cart, { foreignKey: 'productId' });

Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Cart, { foreignKey: 'userId' });

export default sequelize;