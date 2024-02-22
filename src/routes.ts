import { Router } from 'express';
import { CardsController } from './controllers/cards';

const router = Router();

router.get('/cards', CardsController.getCards);
router.post('/cards', CardsController.createCard);
router.patch('/cards/:id', CardsController.updateCard);
router.patch('/cards', CardsController.updateCardOrder);
router.delete('/cards/:id', CardsController.deleteCard);

export { router };
