import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserService } from '@modules/users/services/CreateUserService';
import { ListUsersService } from '@modules/users/services/ListUsersService';

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password, name, phone } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ email, password, name, phone });

    return response.json(user);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const listUser = container.resolve(ListUsersService);

    const users = await listUser.execute();

    return response.json(users);
  }
}

export { UsersController };
