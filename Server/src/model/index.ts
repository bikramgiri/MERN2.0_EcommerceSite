import {Sequelize, DataTypes} from 'sequelize';
import dbConfig from '../config/dbConfig';

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      pool: {
            max : dbConfig.pool.max,
            min : dbConfig.pool.min,
            idle : dbConfig.pool.idle,
            acquire: dbConfig.pool.acquire
      }
}); 

sequelize.authenticate() 
    .then(() => {
        console.log('Database connection has been established successfully.') 
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err) 
    })

    const db:any = {} 
    db.Sequelize = Sequelize   
    db.sequelize = sequelize 

    db.sequelize.sync({force: false }).then(() => { 
      console.log('Synced done!!') 
    })
 
export default db

