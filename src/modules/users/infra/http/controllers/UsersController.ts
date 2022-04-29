import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserService } from '@modules/users/services/CreateUserService';

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password, name, phone } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ email, password, name, phone });

    return response.json(classToClass(user));
  }
}

export { UsersController };
