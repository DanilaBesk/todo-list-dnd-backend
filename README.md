# TODO LIST BACKEND

## Technologies:

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## Information

Backend приложение, написанное на Express, позволяет управлять карточками для планирования дел. У карточки есть название, описание, статус и порядок. В приложении используется клиент Prisma. Для хранения карточек используется СУБД PostgreSQL.

## Setup

1. Клонировать репозиторий и установить зависимости:

```
npm install
```

2. Создать .env.development файл и проставить значения следующим переменным:

```
DATABASE_URL=
DIRECT_URL=
PORT=
CLIENT_URL=
NODE_ENV=development
```

3. Запустить приложение:

```
npm run start
```

или в режиме наблюдения:

```
npm run dev
```

## Доступные команды

- `npm run start`: Запускает приложение в режиме разработки, используя переменные окружения из файла .env.development.
- `npm run dev`: Запускает приложение в режиме наблюдения (watch mode) для разработки, автоматически перезапуская при изменении файлов. Использует переменные окружения из файла .env.development.
- `npm run build`: Собирает проект для продакшн режима. Устанавливает переменную окружения NODE_ENV в production, очищает папку dist и компилирует TypeScript файлы согласно tsconfig.build.json, а затем обрабатывает алиасы.
- `npm run start:prod`: Выполняет сборку проекта, генерирует клиент Prisma, а затем запускает приложение в продакшн режиме, используя переменные окружения из файла .env.production.
- `npm run test:unit`: Запускает юнит-тесты с использованием Jest. Использует переменные окружения из файла .env.test.
- `npm run test:all`: Запускает все тесты.
- `npm run generate`: Генерирует клиент Prisma на основе текущей схемы Prisma.
- `npm run migrate:dev`: Выполняет миграции базы данных в режиме разработки, используя переменные окружения из файла .env.development.
- `npm run migrate:deploy`: Применяет миграции базы данных в продакшн режиме, используя переменные окружения из файла .env.production.

## Тесты

Для этого проекта написаны следующие тесты:

- Юнит тесты: `validate-data.ts`, `error-middleware.ts`, `handle-prisma-error.ts`, `cards.controller.ts` и `cards.service.ts`.
