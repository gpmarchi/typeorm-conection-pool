import { Router } from 'express';

import { UsersController } from '../controllers/UsersController';
import userCreateValidator from '../validators/UserCreate';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', userCreateValidator, usersController.create);

export { usersRouter };
