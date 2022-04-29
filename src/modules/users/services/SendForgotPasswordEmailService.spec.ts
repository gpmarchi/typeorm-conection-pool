import { FakeMailProvider } from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { AppError } from '@shared/errors/AppError';

import { FakePasswordRecoveryTokensRepository } from '../repositories/fakes/FakePasswordRecoveryTokensRepository';
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakePasswordRecoveryTokensRepository: FakePasswordRecoveryTokensRepository;
let fakeMailProvider: FakeMailProvider;

let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePasswordRecoveryTokensRepository =
      new FakePasswordRecoveryTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakePasswordRecoveryTokensRepository,
      fakeMailProvider,
    );
  });

  it('should be able to create new password recovery token for user', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    const create = jest.spyOn(fakePasswordRecoveryTokensRepository, 'create');

    await sendForgotPasswordEmail.execute(user.email);

    expect(create).toHaveBeenCalledWith(user.id);
  });

  it('should be able to send password recovery email to user', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await sendForgotPasswordEmail.execute(user.email);

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send password recovery email to inexistent user', async () => {
    await expect(
      sendForgotPasswordEmail.execute('random@email.com'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
