import {Sequelize} from 'sequelize-typescript';

const sequelize = new Sequelize({
      database : process.env.DB_NAME as string,
      dialect: process.env.DB_DIALECT as any,
      username : process.env.DB_USERNAME as string,
      password : process.env.DB_PASSWORD as string,
      host : process.env.DB_HOST as string,
      port : Number(process.env.DB_PORT),
      models: [__dirname + '/models']
});

sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.')
      })
      .catch(err => {
            console.error('Unable to connect to the database:', err)
      })

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Models synced successfully!');
  })
  .catch((err) => {
    console.error('Sync failed:', err);
  });

export default sequelize;