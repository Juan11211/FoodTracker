import express from 'express';
import mongoose from 'mongoose';
import { MONGODBURI } from './config.js';
import morgan from 'morgan';
import cors from 'cors';
import foodEntryRoute from './routes/foodEntryRoute.js'; 
import userRouter from './routes/userRoute.js';
import openaiRoute from './routes/openaiRoute.js';
import { expressjwt } from 'express-jwt'

const app = express();
const PORT = 9000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', userRouter);
app.use('/api', expressjwt({ secret: process.env.SECRET, algorithms: ['HS256'] }));
app.use('/api/food', foodEntryRoute);
app.use('/ai', openaiRoute);

mongoose
  .connect(MONGODBURI)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
