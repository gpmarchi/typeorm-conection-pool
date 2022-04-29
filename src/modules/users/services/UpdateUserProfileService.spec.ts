import { AppError } from '@shared/errors/AppError';

import { FakeHashProvider } from '../providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository';
import { UpdateUserProfileService } from './UpdateUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfile: UpdateUserProfileService;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUserProfile = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      name: 'John',
      email: 'john@email.com',
    });

    expect(updatedUser.name).toBe('John');
  });

  it('should be able to update user password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update inexistent user profile', async () => {
    await expect(
      updateUserProfile.execute({
        user_id: 'owiueriowu',
        name: 'John',
        email: 'john@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user profile with already registered email', async () => {
    await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    const user = await fakeUsersRepository.create({
      email: 'mike@email.com',
      password: '123456',
      name: 'Mike',
      phone: '123456',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        email: 'johndoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password without providing old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password if old password does not match', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        password: '123123',
        old_password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
