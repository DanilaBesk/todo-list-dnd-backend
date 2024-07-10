import {
  TCreateCard,
  TDeleteCard,
  TUpdateCard,
  TUpdateCardOrder,
} from '#/cards/cards.shemas';
import { DataBaseError } from '#/lib/errors/api-error';
import { handlePrismaError } from '#/lib/errors/handle-prisma-error';
import prisma from '#/lib/prisma';

export class CardsService {
  static async getCards() {
    try {
      const cards = await prisma.card.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return cards;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  static async createCard({ status, title }: TCreateCard) {
    try {
      const lastCardOrder = (
        await prisma.card.aggregate({
          where: { status },
          _max: { order: true },
        })
      )?._max?.order;
      const newOrder = lastCardOrder ? lastCardOrder + 1 : 1;

      const card = await prisma.card.create({
        data: { title, order: newOrder, status },
      });

      return card;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  static async updateCard({ id, title, description }: TUpdateCard) {
    try {
      const card = await prisma.card.update({
        where: { id },
        data: { description, title },
      });
      return card;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  static async updateCardOrder({ items }: TUpdateCardOrder) {
    try {
      const updatedCards = await prisma.$transaction(
        items.map((card) =>
          prisma.card.update({
            where: { id: card.id },
            data: { order: card.order, status: card.status },
          })
        )
      );
      const newItems = updatedCards.map((el) => ({
        id: el.id,
        status: el.status,
        order: el.order,
      }));

      return newItems;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  static async deleteCard({ id }: TDeleteCard) {
    try {
      const card = await prisma.card.delete({ where: { id } });
      return card;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
