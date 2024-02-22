import { Card } from '@prisma/client';
import request from 'supertest';
import { app } from '../src/index';
import { db } from '../src/lib/db';

describe('API tests', () => {
  beforeAll(async () => {
    await db.card.deleteMany();
  });
  describe('test CRUD', () => {
    let cardId1: string;
    let cardId2: string;

    const card1 = {
      title: 'read a book',
      updateTitle: 'cook',
      description: 'read a very long interesting book, when i bought last yera',
      status: 'DOING',
    };
    const card2 = {
      title: 'sport',
      updateTitle: 'clean',
      description: 'very hard sport with run and jump to Space',
      status: 'TODO',
    };
    test('create first and second card', async () => {
      const firstResponse = await request(app)
        .post('/api/cards')
        .send({ title: card1.title, status: card1.status });
      expect(firstResponse.status).toBe(200);
      expect(firstResponse.body.data).toHaveProperty('id');
      cardId1 = firstResponse.body.data.id;

      const secondResponse = await request(app)
        .post('/api/cards')
        .send({ title: card2.title, status: card2.status });
      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body.data).toHaveProperty('id');
      cardId2 = secondResponse.body.data.id;
    });
    test('get cards', async () => {
      const response = await request(app).get('/api/cards');
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: cardId1 }),
          expect.objectContaining({ id: cardId2 }),
        ])
      );
    });
    test('update first and second card', async () => {
      const firstResponse = await request(app)
        .patch(`/api/cards/${cardId1}`)
        .send({
          title: card1.updateTitle,
          description: card1.description,
        });

      expect(firstResponse.status).toBe(200);
      expect(firstResponse.body.data.title).toBe(card1.updateTitle);

      const secondResponse = await request(app)
        .patch(`/api/cards/${cardId2}`)
        .send({
          title: card2.updateTitle,
          description: card2.description,
        });

      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body.data.title).toBe(card2.updateTitle);
    });
    test('delete first card', async () => {
      const deleteResponse = await request(app).delete(`/api/cards/${cardId1}`);
      expect(deleteResponse.status).toBe(200);

      const response = await request(app).get('/api/cards');
      expect(response.status).toBe(200);

      expect(response.body.data.some((card: Card) => card.id === cardId2)).toBe(
        true
      );
      expect(response.body.data.some((card: Card) => card.id === cardId1)).toBe(
        false
      );
    });
  });
  describe('test reordering cards', () => {
    const cardsForOrderCheck = [
      {
        title: 'cardOrder1',
        status: 'TODO',
        newOrder: 3,
      },
      {
        title: 'cardOrder2',
        status: 'TODO',
        newOrder: 2,
      },
      {
        title: 'cardOrder3',
        status: 'DOING',
        newOrder: 2,
        newStatus: 'DONE',
      },
      {
        title: 'cardOrder4',
        status: 'DONE',
        newOrder: 1,
        newStatus: 'DONE',
      },
      {
        title: 'cardOrder5',
        status: 'DONE',
        newOrder: 1,
        newStatus: 'DOING',
      },
    ];
    test('cards update order in one list check', async () => {
      const firstCard = await request(app).post('/api/cards').send({
        title: cardsForOrderCheck[0].title,
        status: cardsForOrderCheck[0].status,
      });
      expect(firstCard.status).toBe(200);
      expect(firstCard.body.data).toHaveProperty('id');
      expect(firstCard.body.data.title).toBe(cardsForOrderCheck[0].title);

      const secondCard = await request(app).post('/api/cards').send({
        title: cardsForOrderCheck[1].title,
        status: cardsForOrderCheck[1].status,
      });
      expect(secondCard.status).toBe(200);
      expect(secondCard.body.data).toHaveProperty('id');
      expect(secondCard.body.data.title).toBe(cardsForOrderCheck[1].title);

      const reorderedCards = await request(app)
        .patch('/api/cards')
        .send({
          items: [
            {
              ...firstCard.body.data,
              order: cardsForOrderCheck[0].newOrder,
            },
            {
              ...secondCard.body.data,
              order: cardsForOrderCheck[1].newOrder,
            },
          ],
        });
      expect(reorderedCards.status).toBe(200);

      expect(reorderedCards.body.data[0].title).toBe(
        cardsForOrderCheck[0].title
      );
      expect(reorderedCards.body.data[0].order).toBe(
        cardsForOrderCheck[0].newOrder
      );
      expect(reorderedCards.body.data[0].order).not.toBe(
        firstCard.body.data.order
      );
      expect(reorderedCards.body.data[0].status).toBe(
        firstCard.body.data.status
      );

      expect(reorderedCards.body.data[1].order).toBe(
        cardsForOrderCheck[1].newOrder
      );
      expect(reorderedCards.body.data[1].title).toBe(
        cardsForOrderCheck[1].title
      );
      expect(reorderedCards.body.data[1].order).not.toBe(
        secondCard.body.data.order
      );
      expect(reorderedCards.body.data[1].status).toBe(
        secondCard.body.data.status
      );
    });
    test('cards update order in some lists check', async () => {
      const firstCard = await request(app).post('/api/cards').send({
        title: cardsForOrderCheck[2].title,
        status: cardsForOrderCheck[2].status,
      });
      expect(firstCard.status).toBe(200);
      expect(firstCard.body.data.title).toBe(cardsForOrderCheck[2].title);

      const secondCard = await request(app).post('/api/cards').send({
        title: cardsForOrderCheck[3].title,
        status: cardsForOrderCheck[3].status,
      });
      expect(secondCard.status).toBe(200);
      expect(secondCard.body.data.title).toBe(cardsForOrderCheck[3].title);

      const thirdCard = await request(app).post('/api/cards').send({
        title: cardsForOrderCheck[4].title,
        status: cardsForOrderCheck[4].status,
      });
      expect(thirdCard.status).toBe(200);
      expect(thirdCard.body.data.title).toBe(cardsForOrderCheck[4].title);

      const reorderedCards = await request(app)
        .patch('/api/cards')
        .send({
          items: [
            {
              ...firstCard.body.data,
              order: cardsForOrderCheck[2].newOrder,
              status: cardsForOrderCheck[2].newStatus, //меняется с DOING на DONE, order: 2, те ниже чем вторая
            },
            {
              ...secondCard.body.data,
              order: cardsForOrderCheck[3].newOrder,
              status: cardsForOrderCheck[3].newStatus, //не меняется, на месте
            },
            {
              ...thirdCard.body.data,
              order: cardsForOrderCheck[4].newOrder,
              status: cardsForOrderCheck[4].newStatus, //меняется с DONE на DOING, order: 1, те первая
            },
          ],
        });
      expect(reorderedCards.status).toBe(200);

      expect(reorderedCards.body.data[0].title).toBe(
        cardsForOrderCheck[2].title
      );
      expect(reorderedCards.body.data[0].order).toBe(
        cardsForOrderCheck[2].newOrder
      );
      expect(reorderedCards.body.data[0].status).toBe(
        cardsForOrderCheck[2].newStatus
      );
      expect(reorderedCards.body.data[0].order).not.toBe(
        firstCard.body.data.order
      );

      expect(reorderedCards.body.data[1].order).toBe(
        secondCard.body.data.order
      ); //не должно измениться
      expect(reorderedCards.body.data[1].title).toBe(
        cardsForOrderCheck[3].title
      );
      expect(reorderedCards.body.data[1].status).toBe(
        cardsForOrderCheck[3].newStatus
      );

      expect(reorderedCards.body.data[2].order).toBe(
        cardsForOrderCheck[4].newOrder
      );
      expect(reorderedCards.body.data[2].title).toBe(
        cardsForOrderCheck[4].title
      );
      expect(reorderedCards.body.data[2].status).toBe(
        cardsForOrderCheck[4].newStatus
      );
      expect(reorderedCards.body.data[1].order).not.toBe(
        thirdCard.body.data.order
      );
    }, 10000);
  });
});
