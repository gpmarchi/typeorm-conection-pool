import { IMailDataDTO } from '../dto/IMailDataDTO';

interface IMailProvider {
  sendMail(message: IMailDataDTO): Promise<void>;
}

export { IMailProvider };
