import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';

import { User } from '../infra/typeorm/entities/User';

interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;

  findByEmail(email: string): Promise<User | undefined>;

  findAll(): Promise<User[]>;

  create(userData: ICreateUserDTO): Promise<User>;
}

export { IUsersRepository };
