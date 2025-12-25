"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const sequelize = new sequelize_1.Sequelize(dbConfig_1.default.db, dbConfig_1.default.user, dbConfig_1.default.password, {
    host: dbConfig_1.default.host,
    dialect: dbConfig_1.default.dialect,
    pool: {
        max: dbConfig_1.default.pool.max,
        min: dbConfig_1.default.pool.min,
        idle: dbConfig_1.default.pool.idle,
        acquire: dbConfig_1.default.pool.acquire
    }
});
sequelize.authenticate() // Authenticate the connection to the database
    .then(() => {
    console.log('Database connection has been established successfully.'); // Log a success message if the connection is successful
})
    .catch(err => {
    console.error('Unable to connect to the database:', err); // Log an error message if the connection fails
});
const db = {}; // Create an empty object to hold the models
db.Sequelize = sequelize_1.Sequelize; // Add Sequelize class to the db object  
db.sequelize = sequelize; // Add sequelize  to the db object
db.sequelize.sync({ force: false }).then(() => {
    console.log('Synced done!!'); // Log a message indicating that the database has been synced
});
exports.default = db; // Export the db object so that it can be used in other files
//# sourceMappingURL=index.js.map