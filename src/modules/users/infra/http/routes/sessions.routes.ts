import { Router } from 'express';

import { SessionsController } from '../controllers/SessionsController';
import sessionCreateValidator from '../validators/SessionCreate';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post('/', sessionCreateValidator, sessionsController.create);

export { sessionsRouter };
