import { CardsController } from '#/cards/cards.controller';
import {
  CreateCardSchema,
  DeleteCardSchema,
  UpdateCardOrderSchema,
  UpdateCardSchema,
} from '#/cards/cards.shemas';
import { validateData } from '#/lib/validate-data';
import { Router } from 'express';

const cardsRouter = Router();

cardsRouter.get('/', CardsController.getCards);
cardsRouter.post('/', CardsController.createCard);
cardsRouter.patch('/:id', CardsController.updateCard);
cardsRouter.patch('/', CardsController.updateCardOrder);
cardsRouter.delete('/:id', CardsController.deleteCard);

export { cardsRouter };
