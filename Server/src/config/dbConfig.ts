
type DataBase = {
      host : string;
      user : string;
      password : string;
      db : string;
      // port: number;
      dialect : 'mysql';
      pool : {
            max : number;
            min : number;
            idle : number;
            acquire: number;
      }
}

const dbConfig : DataBase = {
      host : process.env.DB_HOST || '',
      user : process.env.DB_USER || 'root',
      password : process.env.DB_PASSWORD || '',
      db : process.env.DB_NAME || '',
      // port: 3306,  // localhost port
      // port: 59867,   // production
      dialect : 'mysql',
      pool : {
            max : 5,
            min : 0,
            idle : 10000,
            acquire: 30000
      }
}
export default dbConfig;
