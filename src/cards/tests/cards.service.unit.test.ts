import { Card, Prisma } from '@prisma/client';
import { prismaMock } from '#/lib/__mocks__/prisma';
import prisma from '#/lib/prisma';
import { CardsService } from '#/cards/cards.service';
import { handlePrismaError } from '#/lib/errors/handle-prisma-error';
import { TUpdateCardOrder } from '../cards.shemas';

jest.mock('#/lib/errors/handle-prisma-error', () => ({
  __esModule: true,
  handlePrismaError: jest.fn().mockImplementation((error: unknown) => {
    throw error;
  }),
}));
describe('CardsService', () => {
  const handlePrismaErrorMock = handlePrismaError as jest.MockedFunction<
    typeof handlePrismaError
  >;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date());
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCards', () => {
    it('Should return a list of the cards ordered by createdAt descending', async () => {
      const mockCards: Card[] = [
        {
          id: '2',
          title: 'title 2',
          description: 'description 2',
          status: 'DONE',
          createdAt: new Date('2023-06-10'),
          updatedAt: new Date('2023-06-10'),
          order: 2,
        },
        {
          id: '1',
          title: 'title 1',
          description: null,
          status: 'DOING',
          createdAt: new Date('2023-06-08'),
          updatedAt: new Date('2023-06-08'),
          order: 1,
        },
      ];

      prismaMock.card.findMany.mockResolvedValueOnce(mockCards);

      await expect(CardsService.getCards()).resolves.toEqual([
        {
          id: '2',
          title: 'title 2',
          description: 'description 2',
          status: 'DONE',
          createdAt: new Date('2023-06-10'),
          updatedAt: new Date('2023-06-10'),
          order: 2,
        },
        {
          id: '1',
          title: 'title 1',
          description: null,
          status: 'DOING',
          createdAt: new Date('2023-06-08'),
          updatedAt: new Date('2023-06-08'),
          order: 1,
        },
      ]);
      expect(prismaMock.card.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
    it('Should throw an error if prisma.card.findMay throws an error', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Test prisma error',
        { clientVersion: '1', code: '1' }
      );
      prismaMock.card.findMany.mockRejectedValueOnce(prismaError);

      await expect(CardsService.getCards()).rejects.toThrow(prismaError);

      expect(handlePrismaErrorMock).toHaveBeenCalledWith(prismaError);
    });
  });
  describe('createCard', () => {
    it('Should create the card, where last order in current status exist', async () => {
      const card: Card = {
        id: '1',
        title: 'title',
        description: null,
        status: 'TODO',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 6,
      };

      prismaMock.card.aggregate.mockResolvedValueOnce({
        _max: { order: 5 },
        _avg: undefined,
        _min: undefined,
        _sum: undefined,
        _count: undefined,
      });
      prismaMock.card.create.mockResolvedValueOnce(card);

      await expect(
        CardsService.createCard({ title: card.title, status: card.status })
      ).resolves.toEqual({
        id: '1',
        title: 'title',
        description: null,
        status: 'TODO',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 6,
      });
      expect(prismaMock.card.aggregate).toHaveBeenCalledWith({
        where: {
          status: 'TODO',
        },
        _max: { order: true },
      });
      expect(prismaMock.card.create).toHaveBeenCalledWith({
        data: {
          title: 'title',
          status: 'TODO',
          order: 6,
        },
      });
    });
    it('Should create the card, where last order in current status not exist', async () => {
      const card: Card = {
        id: '1',
        title: 'title',
        description: null,
        status: 'TODO',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 1,
      };

      prismaMock.card.aggregate.mockResolvedValueOnce({
        _max: { order: null },
        _avg: undefined,
        _min: undefined,
        _sum: undefined,
        _count: undefined,
      });
      prismaMock.card.create.mockResolvedValueOnce(card);

      await expect(
        CardsService.createCard({ title: card.title, status: card.status })
      ).resolves.toEqual({
        id: '1',
        title: 'title',
        description: null,
        status: 'TODO',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 1,
      });
      expect(prismaMock.card.aggregate).toHaveBeenCalledWith({
        where: {
          status: 'TODO',
        },
        _max: { order: true },
      });
      expect(prismaMock.card.create).toHaveBeenCalledWith({
        data: {
          title: 'title',
          status: 'TODO',
          order: 1,
        },
      });
    });
    it('Should throw an error if prisma.card.create throws an error', async () => {
      prismaMock.card.aggregate.mockResolvedValueOnce({
        _max: { order: null },
        _avg: undefined,
        _min: undefined,
        _sum: undefined,
        _count: undefined,
      });
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Test prisma error',
        { clientVersion: '1', code: '1' }
      );
      prismaMock.card.create.mockRejectedValueOnce(prismaError);

      await expect(
        CardsService.createCard({
          title: 'title',
          status: 'DOING',
        })
      ).rejects.toThrow(prismaError); // Mock handlePrismaError throws an error from arguments

      expect(handlePrismaErrorMock).toHaveBeenCalledWith(prismaError);
    });
    it('Should throw an error if prisma.card.aggregate throws an error', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Test prisma error',
        { clientVersion: '1', code: '1' }
      );
      prismaMock.card.aggregate.mockRejectedValueOnce(prismaError);

      await expect(
        CardsService.createCard({
          title: 'title',
          status: 'DOING',
        })
      ).rejects.toThrow(prismaError);

      expect(handlePrismaErrorMock).toHaveBeenCalledWith(prismaError);
    });
  });
  describe('updateCard', () => {
    it("Should update the card's title and description", async () => {
      const card: Card = {
        id: '1',
        title: 'updated title',
        description: 'updated description',
        status: 'DOING',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 1,
      };

      prismaMock.card.update.mockResolvedValueOnce(card);

      await expect(
        CardsService.updateCard({
          id: card.id,
          title: card.title,
          description: card.description,
        })
      ).resolves.toEqual({
        id: '1',
        title: 'updated title',
        description: 'updated description',
        status: 'DOING',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 1,
      });
      expect(prismaMock.card.update).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        data: {
          title: 'updated title',
          description: 'updated description',
        },
      });
    });
    it('Should throw an error if prisma.card.update throws an error', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Test prisma error',
        { clientVersion: '1', code: '1' }
      );
      prismaMock.card.update.mockRejectedValueOnce(prismaError);

      await expect(
        CardsService.updateCard({
          id: '1',
          title: 'updated title',
          description: 'updated description',
        })
      ).rejects.toThrow(prismaError);

      expect(handlePrismaErrorMock).toHaveBeenCalledWith(prismaError);
    });
  });
  describe('updateCardOrder', () => {
    it('Should update the order of the cards', async () => {
      const mockCards: Card[] = [
        {
          id: '1',
          title: 'title 1',
          description: null,
          status: 'TODO',
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 1,
        },
        {
          id: '2',
          title: 'title 2',
          description: null,
          status: 'TODO',
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 2,
        },
      ];
      const items = mockCards.map((card) => ({
        id: card.id,
        status: card.status,
        order: card.order,
      }));

      prismaMock.$transaction.mockResolvedValueOnce(mockCards);

      await expect(CardsService.updateCardOrder({ items })).resolves.toEqual([
        {
          id: '1',
          status: 'TODO',
          order: 1,
        },
        {
          id: '2',
          status: 'TODO',
          order: 2,
        },
      ]);
      expect(prismaMock.$transaction).toHaveBeenCalledWith(
        items.map((card) =>
          prismaMock.card.update({
            where: { id: card.id },
            data: { order: card.order, status: card.status },
          })
        )
      );
    });

    it('Should throw an error if prisma.$transaction throws an error', async () => {
      const items: TUpdateCardOrder['items'] = [
        { id: '1', status: 'TODO', order: 1 },
        { id: '2', status: 'TODO', order: 2 },
      ];

      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Test prisma error',
        { clientVersion: '1', code: '1' }
      );
      prismaMock.$transaction.mockRejectedValueOnce(prismaError);

      await expect(CardsService.updateCardOrder({ items })).rejects.toThrow(
        prismaError
      );
      expect(handlePrismaErrorMock).toHaveBeenCalledWith(prismaError);
    });
  });

  describe('deleteCard', () => {
    it('Should delete the card', async () => {
      const card: Card = {
        id: '1',
        title: 'title',
        description: 'description',
        status: 'DOING',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 1,
      };

      prismaMock.card.delete.mockResolvedValueOnce(card);

      await expect(CardsService.deleteCard({ id: card.id })).resolves.toEqual({
        id: '1',
        title: 'title',
        description: 'description',
        status: 'DOING',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 1,
      });
      expect(prismaMock.card.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });
    it('Should throw an error if prisma.card.delete throws an error', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Test prisma error',
        { clientVersion: '1', code: '1' }
      );
      prismaMock.card.delete.mockRejectedValueOnce(prismaError);

      await expect(
        CardsService.deleteCard({
          id: '1',
        })
      ).rejects.toThrow(prismaError);

      expect(handlePrismaErrorMock).toHaveBeenCalledWith(prismaError);
    });
  });
});
