import {
  createCardSchema,
  deleteCardSchema,
  updateCardOrderSchema,
  updateCardSchema,
} from './../zod-validation-schema/card-shema';
import { NextFunction, Request, Response } from 'express';
import { db } from '../lib/db';
import { ApiError } from '../errors/api-error';
import { validateSchema } from '../lib/createSafeController';

export class CardsController {
  static async getCards(req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await db.card.findMany({ orderBy: { createdAt: 'desc' } });

      res.status(200).json({ data: cards });
    } catch (error) {
      next(error);
    }
  }

  static async createCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, status } = validateSchema(createCardSchema, req.body);

      const lastCardOrder = (await db.card.aggregate({ _max: { order: true } }))
        ?._max?.order;
      const newOrder = lastCardOrder ? lastCardOrder + 1 : 1;

      const card = await db.card.create({
        data: { title, order: newOrder, status },
      });

      res.status(200).json({ data: card });
    } catch (error) {
      next(error);
    }
  }

  static async updateCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, ...data } = validateSchema(updateCardSchema, req.body);

      const card = await db.card.update({
        where: { id },
        data: { ...data },
      });

      res.status(200).json({ data: card });
    } catch (error) {
      next(error);
    }
  }

  static async updateCardsOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { items } = validateSchema(updateCardOrderSchema, req.body);

      const updatedCardsOrder = await db.$transaction(
        items.map((card) =>
          db.card.update({
            where: { id: card.id },
            data: { order: card.order, status: card.status },
          })
        )
      );

      res.status(200).json({ data: updatedCardsOrder });
    } catch (error) {
      next(error);
    }
  }
  static async deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = validateSchema(deleteCardSchema, req.body);
      const card = await db.card.delete({ where: { id } });

      res.status(200).json({ data: card });
    } catch (error) {
      next(error);
    }
  }
}