import {
  CreateCardSchema,
  DeleteCardSchema,
  UpdateCardOrderSchema,
  UpdateCardSchema,
} from '#/cards/cards.schemas';
import { CardsService } from '#/cards/cards.service';
import { validateData } from '#/lib/validate-data';
import { NextFunction, Request, Response } from 'express';
export class CardsController {
  static async getCards(req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await CardsService.getCards();

      res.status(200).json({ data: cards });
    } catch (error) {
      next(error);
    }
  }

  static createCard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        body: { title, status },
      } = await validateData(CreateCardSchema, req);

      const card = await CardsService.createCard({ title, status });

      res.status(200).json({ data: card });
    } catch (error) {
      next(error);
    }
  };

  static async updateCard(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        params: { id },
        body: { title, description },
      } = await validateData(UpdateCardSchema, req);

      const card = await CardsService.updateCard({ id, title, description });

      res.status(200).json({ data: card });
    } catch (error) {
      next(error);
    }
  }

  static async updateCardOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        body: { items },
      } = await validateData(UpdateCardOrderSchema, req);

      const newItems = await CardsService.updateCardOrder({ items });

      res.status(200).json({
        data: newItems,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        params: { id },
      } = await validateData(DeleteCardSchema, req);

      const card = await CardsService.deleteCard({ id });

      res.status(200).json({ data: card });
    } catch (error) {
      next(error);
    }
  }
}
