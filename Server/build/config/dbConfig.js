"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    db: process.env.DB_NAME || 'merntwoecsite',
    // port: 3306,  // localhost port
    // port: 59867,   // production
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
        acquire: 30000
    }
};
exports.default = dbConfig;
//# sourceMappingURL=dbConfig.js.map