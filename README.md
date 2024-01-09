# TODO LIST
Backend for small todolist app.
## Technologies:
Prisma, express, postgress, zod, typescript and tests with supertest and jest

<p>
  ![image](https://github.com/DanilaBesk/todo-list-dnd-backend/assets/127431527/f7e2b209-492d-4347-8fe7-c8273b09df5f)
</p>

I used custom class Api Errors to manage errors, an auxiliary function for the secure validation of data according to the zod scheme, and also used controllers for routes

There are 5 routes on the backend: receiving all cards, creating, updating and deleting one card, as well as reordering cards (each has its own status and order in the current sheet)
