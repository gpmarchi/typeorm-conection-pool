import 'reflect-metadata';
import 'express-async-errors';

import cluster from 'cluster';
import express from 'express';
import os from 'os';

import errorHandler from './middlewares/errorHandler';
import { routes } from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const numCpu = os.cpus().length;

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);

if (cluster.isMaster) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
} else {
  app.listen(3333, () => {
    console.log(`🚀 Server process ${process.pid} started on port 3333!`);
  });
}

// app.listen(3333, () => {
//   console.log('🚀 Server started on port 3333!');
// });
