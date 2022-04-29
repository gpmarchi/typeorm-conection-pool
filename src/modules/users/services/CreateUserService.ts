import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { User } from '../infra/typeorm/entities/User';
import { IUsersRepository } from '../repositories/IUsersRepository';

interface IRequestDTO {
  email: string;
  password: string;
  name: string;
  phone: string;
}

@injectable()
class CreateUserService {
  private usersRepository: IUsersRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
  ) {
    this.usersRepository = usersRepository;
  }

  public async execute({
    email,
    password,
    name,
    phone,
  }: IRequestDTO): Promise<User> {
    const registeredUser = await this.usersRepository.findByEmail(email);

    if (registeredUser) {
      throw new AppError('User already registered.', 400);
    }

    const user = this.usersRepository.create({
      email,
      password,
      name,
      phone,
    });

    return user;
  }
}

export { CreateUserService };
