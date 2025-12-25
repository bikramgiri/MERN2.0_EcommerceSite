"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// Database connection
require('./model/index');
app.get('/', (req, res) => {
    res.send('E-Commerce Site Server is running');
});
app.get('/about', (req, res) => {
    res.send('About E-Commerce Site Server');
});
app.get('/contact', (req, res) => {
    res.send('Contact E-Commerce Site Server');
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map