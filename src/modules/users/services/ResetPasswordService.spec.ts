import { AppError } from '@shared/errors/AppError';

import { FakeHashProvider } from '../providers/HashProvider/fakes/FakeHashProvider';
import { FakePasswordRecoveryTokensRepository } from '../repositories/fakes/FakePasswordRecoveryTokensRepository';
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository';
import { ResetPasswordService } from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakePasswordRecoveryTokensRepository: FakePasswordRecoveryTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePasswordRecoveryTokensRepository =
      new FakePasswordRecoveryTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakePasswordRecoveryTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    const passwordRecoveryToken =
      await fakePasswordRecoveryTokensRepository.create(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: '123123',
      token: passwordRecoveryToken.token,
    });

    const userWithNewPassword = await fakeUsersRepository.findById(user.id);

    expect(userWithNewPassword).toHaveProperty('password');
    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(userWithNewPassword?.password).toBe('123123');
  });

  it('should not be able to reset password with invalid token', async () => {
    await expect(
      resetPassword.execute({
        password: '123123',
        token: 'dfkhjg3894752384',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non existing user', async () => {
    const { token } = await fakePasswordRecoveryTokensRepository.create(
      'non existing user',
    );

    await expect(
      resetPassword.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password after 2 hours of token creation', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    const { token } = await fakePasswordRecoveryTokensRepository.create(
      user.id,
    );

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const today = new Date();
      today.setHours(today.getHours() + 4);
      return today.getTime();
    });

    await expect(
      resetPassword.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
