import { AppError } from '@shared/errors/AppError';

import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository';
import { ShowUserProfileService } from './ShowUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showUserProfile: ShowUserProfileService;

describe('ShowUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showUserProfile = new ShowUserProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: '123456',
      name: 'John Doe',
      phone: '123456',
    });

    const userProfile = await showUserProfile.execute({ user_id: user.id });

    expect(userProfile).toMatchObject(user);
  });

  it('should not show inexistent user profile', async () => {
    await expect(
      showUserProfile.execute({ user_id: '99999' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
