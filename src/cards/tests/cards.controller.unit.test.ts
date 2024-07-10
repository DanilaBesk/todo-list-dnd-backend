import { Request, Response, NextFunction } from 'express';
import { Card } from '@prisma/client';
import { CardsController } from '#/cards/cards.controller';
import { CardsService } from '#/cards/cards.service';
import { validateData } from '#/lib/validate-data';
import {
  CreateCardSchema,
  DeleteCardSchema,
  TUpdateCardOrder,
  UpdateCardOrderSchema,
  UpdateCardSchema,
} from '#/cards/cards.shemas';
import {
  ValidationError,
  BadRequestError,
  DataBaseError,
} from '#/lib/errors/api-error';

jest.mock('#/cards/cards.service', () => ({
  __esModule: true,
  CardsService: {
    createCard: jest.fn(),
    updateCard: jest.fn(),
    updateCardOrder: jest.fn(),
    deleteCard: jest.fn(),
    getCards: jest.fn(),
  },
}));
jest.mock('#/lib/validate-data', () => ({
  __esModule: true,
  validateData: jest.fn(),
}));

describe('CardsController', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  const CardsServiceMock = CardsService as jest.Mocked<typeof CardsService>;
  const validateDataMock = validateData as jest.MockedFunction<
    typeof validateData
  >;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date());
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  describe('getCards', () => {
    it('Should return a list of the cards', async () => {
      const mockCards: Card[] = [
        {
          id: '1',
          title: 'title',
          description: null,
          status: 'TODO',
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 1,
        },
      ];
      CardsServiceMock.getCards.mockResolvedValueOnce(mockCards);

      await CardsController.getCards(req, res, next);

      expect(CardsService.getCards).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockCards });
    });

    it('Should handle service errors', async () => {
      const error = new DataBaseError('Error in data base');
      CardsServiceMock.getCards.mockRejectedValueOnce(error);

      await CardsController.getCards(req, res, next);

      expect(CardsServiceMock.getCards).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('createCard', () => {
    it('Should create the card', async () => {
      const mockCard: Card = {
        id: '1',
        title: 'title',
        description: null,
        status: 'TODO',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 1,
      };
      validateDataMock.mockResolvedValueOnce({
        body: { title: 'title', status: 'TODO' },
      });
      CardsServiceMock.createCard.mockResolvedValueOnce(mockCard);

      await CardsController.createCard(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(CreateCardSchema, req);
      expect(CardsService.createCard).toHaveBeenCalledWith({
        title: 'title',
        status: 'TODO',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockCard });
    });

    it('Should handle validation errors', async () => {
      const validationError = new ValidationError([]);
      validateDataMock.mockRejectedValueOnce(validationError);

      await CardsController.createCard(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(CreateCardSchema, req);
      expect(next).toHaveBeenCalledWith(validationError);
    });

    it('Should handle service errors', async () => {
      const error = new DataBaseError('Error in data base');
      validateDataMock.mockResolvedValueOnce({
        body: { title: 'title', status: 'TODO' },
      });
      CardsServiceMock.createCard.mockRejectedValueOnce(error);

      await CardsController.createCard(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(CreateCardSchema, req);
      expect(CardsService.createCard).toHaveBeenCalledWith({
        title: 'title',
        status: 'TODO',
      });
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('updateCard', () => {
    it('Should update the card', async () => {
      const mockCard: Card = {
        id: '1',
        title: 'new title',
        description: null,
        status: 'DOING',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 1,
      };
      validateDataMock.mockResolvedValueOnce({
        body: {
          title: 'new title',
          description: null,
        },
        params: {
          id: '1',
        },
      });
      CardsServiceMock.updateCard.mockResolvedValueOnce(mockCard);

      await CardsController.updateCard(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(UpdateCardSchema, req);
      expect(CardsService.updateCard).toHaveBeenCalledWith({
        title: 'new title',
        description: null,
        id: '1',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockCard });
    });

    it('Should handle validation errors', async () => {
      const validationError = new ValidationError([]);
      validateDataMock.mockRejectedValueOnce(validationError);

      await CardsController.updateCard(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(UpdateCardSchema, req);
      expect(next).toHaveBeenCalledWith(validationError);
    });

    it('Should handle service errors', async () => {
      const error = new DataBaseError('Error in data base');
      validateDataMock.mockResolvedValueOnce({
        body: {
          title: 'new title',
          description: null,
        },
        params: {
          id: '1',
        },
      });
      CardsServiceMock.updateCard.mockRejectedValueOnce(error);

      await CardsController.updateCard(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(UpdateCardSchema, req);
      expect(CardsService.updateCard).toHaveBeenCalledWith({
        title: 'new title',
        description: null,
        id: '1',
      });
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('updateCardOrder', () => {
    it('Should update the order of the cards', async () => {
      const mockCards: TUpdateCardOrder['items'] = [
        {
          id: '1',
          status: 'DOING',
          order: 1,
        },
        {
          id: '2',
          status: 'DOING',
          order: 2,
        },
      ];
      validateDataMock.mockResolvedValueOnce({
        body: {
          items: [
            {
              id: '1',
              status: 'DOING',
              order: 1,
            },
            {
              id: '2',
              status: 'DOING',
              order: 2,
            },
          ],
        },
      });
      CardsServiceMock.updateCardOrder.mockResolvedValueOnce(mockCards);

      await CardsController.updateCardOrder(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(UpdateCardOrderSchema, req);
      expect(CardsService.updateCardOrder).toHaveBeenCalledWith({
        items: [
          {
            id: '1',
            status: 'DOING',
            order: 1,
          },
          {
            id: '2',
            status: 'DOING',
            order: 2,
          },
        ],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockCards });
    });
    it('Should handle validation errors', async () => {
      const validationError = new ValidationError([]);
      validateDataMock.mockRejectedValueOnce(validationError);

      await CardsController.updateCardOrder(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(UpdateCardOrderSchema, req);
      expect(next).toHaveBeenCalledWith(validationError);
    });
    it('Should handle service errors', async () => {
      const error = new DataBaseError('Error in data base');
      validateDataMock.mockResolvedValueOnce({
        body: {
          items: [
            {
              id: '1',
              status: 'DOING',
              order: 1,
            },
            {
              id: '2',
              status: 'DOING',
              order: 2,
            },
          ],
        },
      });
      CardsServiceMock.updateCardOrder.mockRejectedValueOnce(error);

      await CardsController.updateCardOrder(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(UpdateCardOrderSchema, req);
      expect(CardsService.updateCardOrder).toHaveBeenCalledWith({
        items: [
          {
            id: '1',
            status: 'DOING',
            order: 1,
          },
          {
            id: '2',
            status: 'DOING',
            order: 2,
          },
        ],
      });
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('deleteCard', () => {
    it('Should delete the card', async () => {
      const mockCard: Card = {
        id: '1',
        title: 'title',
        description: null,
        status: 'DOING',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 1,
      };
      validateDataMock.mockResolvedValueOnce({
        params: {
          id: '1',
        },
      });
      CardsServiceMock.deleteCard.mockResolvedValueOnce(mockCard);

      await CardsController.deleteCard(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(DeleteCardSchema, req);
      expect(CardsService.deleteCard).toHaveBeenCalledWith({
        id: '1',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockCard });
    });

    it('Should handle validation errors', async () => {
      const validationError = new ValidationError([]);
      validateDataMock.mockRejectedValueOnce(validationError);

      await CardsController.deleteCard(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(DeleteCardSchema, req);
      expect(next).toHaveBeenCalledWith(validationError);
    });

    it('Should handle service errors', async () => {
      const error = new DataBaseError('Error in data base');
      validateDataMock.mockResolvedValueOnce({
        params: {
          id: '1',
        },
      });
      CardsServiceMock.deleteCard.mockRejectedValueOnce(error);

      await CardsController.deleteCard(req, res, next);

      expect(validateDataMock).toHaveBeenCalledWith(DeleteCardSchema, req);
      expect(CardsService.deleteCard).toHaveBeenCalledWith({
        id: '1',
      });
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
