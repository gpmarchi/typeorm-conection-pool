import { v4 as uuid } from 'uuid';

import { PasswordRecoveryToken } from '../../infra/typeorm/entities/PasswordRecoveryToken';
import { IPasswordRecoveryTokensRepository } from '../IPasswordRecoveryTokensRepository';

class FakePasswordRecoveryTokensRepository
  implements IPasswordRecoveryTokensRepository {
  private recoveryTokens: PasswordRecoveryToken[] = [];

  public async create(user_id: string): Promise<PasswordRecoveryToken> {
    const passwordRecoveryToken = new PasswordRecoveryToken();

    Object.assign(passwordRecoveryToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.recoveryTokens.push(passwordRecoveryToken);

    return passwordRecoveryToken;
  }

  public async findByToken(
    token: string,
  ): Promise<PasswordRecoveryToken | undefined> {
    const recoveryToken = this.recoveryTokens.find(
      currentRecoveryToken => currentRecoveryToken.token === token,
    );

    return recoveryToken;
  }
}

export { FakePasswordRecoveryTokensRepository };
