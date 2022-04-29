import path from 'path';
import { injectable, inject } from 'tsyringe';

import { IMailProvider } from '@shared/container/providers/MailProvider/interfaces/IMailProvider';
import { AppError } from '@shared/errors/AppError';

import { IPasswordRecoveryTokensRepository } from '../repositories/IPasswordRecoveryTokensRepository';
import { IUsersRepository } from '../repositories/IUsersRepository';

@injectable()
class SendForgotPasswordEmailService {
  private usersRepository: IUsersRepository;

  private passwordRecoveryTokensRepository: IPasswordRecoveryTokensRepository;

  private mailProvider: IMailProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('PasswordRecoveryTokensRepository')
    passwordRecoveryTokensRepository: IPasswordRecoveryTokensRepository,
    @inject('MailProvider')
    mailProvider: IMailProvider,
  ) {
    this.usersRepository = usersRepository;
    this.passwordRecoveryTokensRepository = passwordRecoveryTokensRepository;
    this.mailProvider = mailProvider;
  }

  public async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email does not exist.', 400);
    }

    const { token } = await this.passwordRecoveryTokensRepository.create(
      user.id,
    );

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: { name: user.name, email: user.email },
      subject: '[App Name] Password recovery',
      template: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
