import {Sequelize} from 'sequelize-typescript';

const sequelize = new Sequelize({
      database : String(process.env.DB_NAME),
      dialect: String(process.env.DB_dialect) as any,
      username : String(process.env.DB_USERNAME),
      password : String(process.env.DB_PASSWORD),
      host : String(process.env.DB_HOST),
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