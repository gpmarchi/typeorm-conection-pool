import { IMailDataDTO } from '../dto/IMailDataDTO';
import { IMailProvider } from '../interfaces/IMailProvider';

class FakeMailProvider implements IMailProvider {
  messages: IMailDataDTO[] = [];

  public async sendMail(message: IMailDataDTO): Promise<void> {
    this.messages.push(message);
  }
}

export { FakeMailProvider };
