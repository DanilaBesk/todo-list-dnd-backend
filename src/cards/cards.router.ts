import { CardsController } from '#/cards/cards.controller';
import { Router } from 'express';

const cardsRouter = Router();

cardsRouter.get('/', CardsController.getCards);
cardsRouter.post('/', CardsController.createCard);
cardsRouter.patch('/:id', CardsController.updateCard);
cardsRouter.patch('/', CardsController.updateCardOrder);
cardsRouter.delete('/:id', CardsController.deleteCard);

export { cardsRouter };
