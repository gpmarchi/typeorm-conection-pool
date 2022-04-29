import { Router } from 'express';

import { UsersProfileController } from '../controllers/UsersProfileController';
import authenticate from '../middlewares/authenticate';
import profileUpdateValidator from '../validators/UserProfileUpdate';

const profileRouter = Router();
const profileController = new UsersProfileController();

profileRouter.patch(
  '/',
  authenticate,
  profileUpdateValidator,
  profileController.update,
);

profileRouter.get('/', authenticate, profileController.show);

export { profileRouter };
