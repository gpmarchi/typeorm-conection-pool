import { isAfter, addHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { IHashProvider } from '../providers/HashProvider/interfaces/IHashProvider';
import { IPasswordRecoveryTokensRepository } from '../repositories/IPasswordRecoveryTokensRepository';
import { IUsersRepository } from '../repositories/IUsersRepository';

interface IRequestDTO {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  private usersRepository: IUsersRepository;

  private passwordRecoveryTokensRepository: IPasswordRecoveryTokensRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('PasswordRecoveryTokensRepository')
    passwordRecoveryTokensRepository: IPasswordRecoveryTokensRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.passwordRecoveryTokensRepository = passwordRecoveryTokensRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ password, token }: IRequestDTO): Promise<void> {
    const passwordRecoveryToken =
      await this.passwordRecoveryTokensRepository.findByToken(token);

    if (!passwordRecoveryToken) {
      throw new AppError('Invalid token provided.');
    }

    const user = await this.usersRepository.findById(
      passwordRecoveryToken.user_id,
    );

    if (!user) {
      throw new AppError('User not found');
    }

    const isValidToken = isAfter(
      addHours(passwordRecoveryToken.created_at, 2),
      Date.now(),
    );

    if (!isValidToken) {
      throw new AppError('Token expired.', 403);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    user.password = hashedPassword;

    await this.usersRepository.save(user);
  }
}

export { ResetPasswordService };
