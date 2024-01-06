import { Router } from 'express';
import { CardsController } from './controllers/card-controller';

const router = Router();

router.get('/card', CardsController.getCards);
router.post('/card', CardsController.createCard);
router.patch('/card/:id', CardsController.updateCard);
router.patch('/card/reorder', CardsController.updateCardsOrder);
router.delete('/card/:id', CardsController.deleteCard);

export { router };
