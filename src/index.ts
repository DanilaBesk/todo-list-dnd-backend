import { cardsRouter } from '#/cards/cards.router';
import { ErrorMiddleware } from '#/lib/middlewares/error-middleware';
import prisma from '#/lib/prisma';
import { CONFIG } from '#config';
import cors from 'cors';
import express, { Application } from 'express';

export const app: Application = express();

app.use(cors({ origin: CONFIG.CLIENT_URL }));
app.use(express.json());
app.use('/api/cards', cardsRouter);
app.use(ErrorMiddleware);

const start = async () => {
  try {
    await prisma.$connect();
    app.listen(CONFIG.PORT, () => {
      console.log(`Server start on PORT ${CONFIG.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
