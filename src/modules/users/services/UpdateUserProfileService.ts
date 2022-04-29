import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { User } from '../infra/typeorm/entities/User';
import { IHashProvider } from '../providers/HashProvider/interfaces/IHashProvider';
import { IUsersRepository } from '../repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  email?: string;
  name?: string;
  phone?: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateUserProfileService {
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
    user_id,
    email,
    name,
    phone,
    old_password,
    password,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists.', 400);
    }

    if (email) {
      const userWithUpdatedEmail = await this.usersRepository.findByEmail(
        email,
      );

      if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
        throw new AppError('Provided email is already registered.', 400);
      }

      user.email = email;
    }

    Object.assign(user, { name, phone });

    if (password && !old_password) {
      throw new AppError('Old password must be provided.', 400);
    }

    if (password && old_password) {
      const oldPasswordMatches = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!oldPasswordMatches) {
        throw new AppError('Old password does not match.', 400);
      }
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.save(user);

    return user;
  }
}

export { UpdateUserProfileService };
