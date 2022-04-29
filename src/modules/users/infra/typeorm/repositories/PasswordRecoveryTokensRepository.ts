import { Repository, getRepository } from 'typeorm';

import { IPasswordRecoveryTokensRepository } from '@modules/users/repositories/IPasswordRecoveryTokensRepository';

import { PasswordRecoveryToken } from '../entities/PasswordRecoveryToken';

class PasswordRecoveryTokensRepository
  implements IPasswordRecoveryTokensRepository {
  private ormRepository: Repository<PasswordRecoveryToken>;

  constructor() {
    this.ormRepository = getRepository(PasswordRecoveryToken);
  }

  public async create(user_id: string): Promise<PasswordRecoveryToken> {
    const passwordRecoveryToken = this.ormRepository.create({ user_id });

    await this.ormRepository.save(passwordRecoveryToken);

    return passwordRecoveryToken;
  }

  public async findByToken(
    token: string,
  ): Promise<PasswordRecoveryToken | undefined> {
    const passwordRecoveryToken = await this.ormRepository.findOne({
      where: { token },
    });

    return passwordRecoveryToken;
  }
}

export { PasswordRecoveryTokensRepository };
