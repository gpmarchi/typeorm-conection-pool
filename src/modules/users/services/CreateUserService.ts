import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { User } from '../infra/typeorm/entities/User';
import { IHashProvider } from '../providers/HashProvider/interfaces/IHashProvider';
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

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
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

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });

    return user;
  }
}

export { CreateUserService };
