import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import { AppError } from '@shared/errors/AppError';

import { User } from '../infra/typeorm/entities/User';
import { IHashProvider } from '../providers/HashProvider/interfaces/IHashProvider';
import { IUsersRepository } from '../repositories/IUsersRepository';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponseDTO {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
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
  }: IRequestDTO): Promise<IResponseDTO> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatches = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const { expiresIn, privateKey } = authConfig.jwt;

    const token = sign({}, privateKey, {
      algorithm: 'RS256',
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export { AuthenticateUserService };
