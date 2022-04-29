import { PasswordRecoveryToken } from '../infra/typeorm/entities/PasswordRecoveryToken';

interface IPasswordRecoveryTokensRepository {
  create(user_id: string): Promise<PasswordRecoveryToken>;
  findByToken(token: string): Promise<PasswordRecoveryToken | undefined>;
}

export { IPasswordRecoveryTokensRepository };
