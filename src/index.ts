import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { ErrorMiddleware } from './middlewares/error-middleware';
import { router } from './routes';
import { db } from './lib/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

export const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', router);
app.use(ErrorMiddleware);

const start = async () => {
  try {
    await db.$connect();
    app.listen(PORT, () => {
      console.log(`Server start on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
