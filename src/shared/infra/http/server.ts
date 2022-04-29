import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';

import errorHandler from './middlewares/errorHandler';
import rateLimiter from './middlewares/rateLimiter';
import { routes } from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(rateLimiter);
app.use(routes);
app.use(errorHandler);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
