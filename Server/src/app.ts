// require('dotenv').config();
// or
import * as dotenv from 'dotenv';
dotenv.config();
// import 'reflect-metadata';
import express, {Application, Request, Response} from 'express';
const app:Application = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// *Database connection
// require('./model/index');
// require('./database/connection');
//or
import './database/connection';

//*Routes
import userRoute from './routes/userRoute';

app.get('/', (req:Request, res:Response) => {
  res.send('E-Commerce Site Server is running');
});

app.use('/users', userRoute);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
