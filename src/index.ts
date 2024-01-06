import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

const app: Application = express();
app.use(cors({ origin: '<http://localhost:3000>' }));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});

app.listen(PORT, () => {
  console.log(`Server start on PORT ${PORT}`);
});
