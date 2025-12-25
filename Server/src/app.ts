require('dotenv').config();
import express, {Application, Request, Response} from 'express';
const app:Application = express();

// Database connection
require('./model/index');

app.get('/', (req:Request, res:Response) => {
  res.send('E-Commerce Site Server is running');
});

app.get('/about', (req:Request, res:Response) => {
  res.send('About E-Commerce Site Server');
});

app.get('/contact', (req:Request, res:Response) =>{
      res.send('Contact E-Commerce Site Server');
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
