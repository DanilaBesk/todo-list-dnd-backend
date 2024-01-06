import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ErrorMiddleware } from './middlewares/error-middleware';
import * as dotenv from 'dotenv';
import { router } from './routes';
dotenv.config();

const PORT = process.env.PORT || 5000;

const app: Application = express();

app.use(cors({ origin: '<http://localhost:3000>' }));
app.use(bodyParser.json());
app.use(router);
app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server start on PORT ${PORT}`);
});
