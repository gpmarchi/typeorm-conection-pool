import { compare, hash } from 'bcrypt';

import { IHashProvider } from '../interfaces/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(
    payload: string,
    hashedPayload: string,
  ): Promise<boolean> {
    return compare(payload, hashedPayload);
  }
}

export { BCryptHashProvider };
