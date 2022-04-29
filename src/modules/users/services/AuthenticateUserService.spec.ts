import { AppError } from '@shared/errors/AppError';

import { FakeHashProvider } from '../providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository';
import { AuthenticateUserService } from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate a user', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    const authenticatedUser = await authenticateUser.execute({
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(authenticatedUser.user).toMatchObject(user);
    expect(authenticatedUser).toHaveProperty('token');
  });

  it('should not be able to authenticate inexistent user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'someotheruser@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user with wrong password', async () => {
    await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoe@email.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
